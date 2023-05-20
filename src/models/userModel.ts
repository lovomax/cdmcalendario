import { PrismaClient, Users } from '@prisma/client'
import { hash, compareSync } from 'bcrypt'
import { GetUser, User, UserInformations, UserUpdateInformations } from '../interfaces/users'

class UserModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    private alphaNumericString (length) : string {
      const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      var retVal = ''
      for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n))
      }
      return retVal
    }

    public async list () : Promise<User | object> {
      const request = await this.prisma.users.findMany()

      return request
    }

    public async getUser (data: GetUser) : Promise<User | object> {
      const findReq = await this.prisma.users.findUnique({ where: { id: data.id } })

      const phoneNumber = await this.prisma.phoneNumbers.findFirst({ where: { userId: data.id } })
      const whatsAppNumber = await this.prisma.whatsAppNumbers.findFirst({ where: { userId: data.id } })

      if (!findReq) {
        throw new Error("Couldn't find a user with that Rut")
      }

      return { ...findReq, phoneNumber, whatsAppNumber }
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
          },
          include: {
            professionals: {
              include: {
                studies: true,
                appointments: true,
                professionalFields: true,
                professionalForecasts: true,
                professionalInterventions: true,
                professionalModalities: true,
                professionalPaymentMethods: true,
                professionalSpecialties: true
              }
            },
            phoneNumbers: true,
            whatsAppNumbers: true
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
      const { whatsAppNumbers, phoneNumbers, id, userForecastId, ...rest } = data

      try {
        const numberUpdateReq = Object.entries({ whatsAppNumbers, phoneNumbers }).map(([key, value]) => {
          if (value !== undefined) {
            const attributeReq = value.map(async (obj) => {
              const repeatedNumber = await this.prisma[key].findFirst({ where: { id: obj.id, AND: { userId: id, roleOfNumber: obj.roleOfNumber } } })
              if (repeatedNumber) {
                return this.prisma[key].update({ where: { id: repeatedNumber.id }, data: { ...obj }, select: { id: true, number: true, roleOfNumber: true, userId: true } })
              } else {
                return this.prisma[key].create({ data: { number: obj.number, roleOfNumber: obj.roleOfNumber, users: { connect: { id: id } } } })
              }
            })

            return attributeReq
          }
        }).filter((item) => item).flat(Infinity)

        const promiseResolve = await Promise.all(numberUpdateReq)

        const jointNumberObj : {whatsAppNumbers: object[], phoneNumbers: object[]} = { whatsAppNumbers: [], phoneNumbers: [] }

        Object.values(promiseResolve).forEach((item, index) => {
          const numberInLength = index < whatsAppNumbers.length
          if (numberInLength) {
            jointNumberObj.whatsAppNumbers.push(item)
          } else {
            jointNumberObj.phoneNumbers.push(item)
          }
        })

        const updateReq = await this.prisma.users.update({
          where: {
            id: id
          },
          data: { ...rest, userForecast: { connect: { id: Number(userForecastId) } } },
          select: {
            id: true,
            email: true,
            imageURL: true,
            name: true,
            lastName: true,
            birthDate: true,
            rut: true,
            phoneNumbers: true,
            whatsAppNumbers: true,
            userForecastId: true
          }
        })

        return { ...updateReq }
      } catch (err) {
        throw new Error(err)
      }
    }
}

export default new UserModel()
