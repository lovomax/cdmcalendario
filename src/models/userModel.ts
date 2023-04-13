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
    private alphaNumericString (length) : string {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      var retVal = ''
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n))
      }
      return retVal
    }
    public async store (data : UserInformations) : Promise<User | object> {
      const { phoneNumbers, whatsAppNumbers, password, ...rest } = data

      var passValue = password
      if (!password) {
        passValue = this.alphaNumericString(8)
      }
      if (!(typeof rest.rut === 'string')) {
        rest.rut = this.alphaNumericString(9)
      }

      const passHash = await hash(passValue, 10)
      const createReq = await this.prisma.users.create({
        data: { ...rest,
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

      const numbers : object[] = []
      if (whatsAppNumbers || phoneNumbers) {
        Object.entries({ whatsAppNumbers, phoneNumbers }).forEach(async ([key, value]) => {
          if (value !== undefined) { numbers.push(this.prisma[key].create({ data: { userId: createReq.id, number: value } })) }
        })
      }

      const promiseNumbers = await Promise.all(numbers)

      return [createReq, promiseNumbers]
    }

    public async logIn (data: UserInformations) : Promise<Users> {
      const { password, rut } = data
      try {
        const userFinder = await this.prisma.users.findUnique({
          where: {
            rut: rut
          }
        })

        if (!userFinder) {
          throw new Error('Wrong rut')
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
              return this.prisma[key].create({ data: { ...obj, users: { connect: { rut: rest.rut } } } })
            }
          })

          return attributeReq
        }
      })
      const updateReq = await this.prisma.users.update({
        where: {
          rut: rest.rut
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
