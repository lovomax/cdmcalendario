import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'
import { User, UserInformations } from '../interfaces/users'

class UserModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async list (data) : Promise<User | object> {
      const request = await this.prisma.users.findMany({ where: { name: data.name } })

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
}

export default new UserModel()
