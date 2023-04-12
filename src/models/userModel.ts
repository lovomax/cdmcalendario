import { PrismaClient, Users } from '@prisma/client'
import { hash, compareSync } from 'bcrypt'
import { User, UserInformations, UserUpdateInformations } from '../interfaces/users'

class UserModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async list () : Promise<User | object> {
      const request = await this.prisma.users.findMany()

      return request
    }

    public async store (data : UserInformations) : Promise<User | object> {
      const { phoneNumber, whatsAppNumber, password, ...rest } = data
      const passHash = await hash(password, 10)
      const createReq = await this.prisma.users.create({
        data: { ...rest,
          phoneNumbers: {
            create: {
              number: phoneNumber
            }
          },
          whatsAppNumbers: {
            create: {
              number: whatsAppNumber
            }
          },
          auth: {
            create: {
              password: passHash
            }
          }
        },
        select: {
          id: true,
          birthDate: true,
          name: true,
          lastName: true,
          imageURL: true,
          email: true,
          rut: true
        }
      })

      return createReq
    }

    public async logIn (data: UserInformations) : Promise<Users> {
      const { password, email } = data
      try {
        const userFinder = await this.prisma.users.findUnique({
          where: {
            email: email
          }
        })

        if (!userFinder) {
          throw new Error('Wrong email')
        }

        const passFinder = await this.prisma.auth.findUniqueOrThrow({
          where: {
            id: userFinder.authId
          }
        })

        const isMatch = compareSync(password, passFinder.password)

        if (isMatch) {
          return userFinder
        } else {
          throw new Error('Wrong password')
        }
      } catch (error) {
        throw error
      }
    }

    public async update (data: UserUpdateInformations) : Promise<User | object> {
      const { whatsAppNumbers, phoneNumbers, ...rest } = data

      Object.entries({ whatsAppNumbers, phoneNumbers }).map(([key, value]) => {
        if (value !== undefined && value.length) {
          const attributeReq = value.map(async (obj) => {
            if (obj.id) {
              return this.prisma[key].update({ where: { id: obj.id }, data: { ...obj } })
            }
            const repeatedNumber = await this.prisma[key].findFirst({ where: { number: obj.number } })

            if (!repeatedNumber) {
              return this.prisma[key].create({ data: { ...obj, users: { connect: { email: rest.email } } } })
            }
          })

          return attributeReq
        }
      })
      const updateReq = await this.prisma.users.update({
        where: {
          email: rest.email
        },
        data: rest,
        select: {
          email: true,
          imageURL: true,
          name: true,
          lastName: true,
          birthDate: true,
          rut: true,
          phoneNumbers: true,
          whatsAppNumbers: true
        }
      })

      return [updateReq]
    }
}

export default new UserModel()
