import { PrismaClient, Users } from '@prisma/client'
import { hash, compareSync } from 'bcrypt'
import { User, UserInformations } from '../interfaces/users'

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

    public async locate (data: UserInformations) : Promise<Users> {
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
}

export default new UserModel()
