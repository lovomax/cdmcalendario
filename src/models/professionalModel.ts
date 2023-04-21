import { PrismaClient } from '@prisma/client'
import { GetProfessional, Professional, ProfessionalInformations } from '../interfaces/professionals'

class ProfessionalModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async store (data : ProfessionalInformations) : Promise<Professional | object> {
      const { studies: study, userId, ...rest } = data
      try {
        const createReq = await this.prisma.professionals.create({
          data: {
            userId,
            studies: {
              create: {
                ...study
              }
            }
          }
        })

        Object.entries(rest).map(async ([key, value]) => {
          if (value) {
            const valueWithId = value.map((obj) => {
              const proId = { ...obj, professionalId: createReq.id }
              return proId
            })

            const attributeReq = await this.prisma[key].createMany({ data: valueWithId })

            return attributeReq
          }
        })

        return { ...createReq }
      } catch (err) {
        throw new Error('Something failed while registering a new professional')
      }
    }

    public async update (data : ProfessionalInformations, idInformation : GetProfessional) : Promise<ProfessionalInformations| object> {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, studies, ...rest } = data

      const updateReq = Object.entries(rest).map(async ([key, value]) => {
        if (value) {
          const arrayAttribute = value.map(async (obj) => {
            if (obj.id) {
              const sameProfessional = await this.prisma[key].findFirst({ where: { id: obj.id } })
              if (sameProfessional) {
                if (sameProfessional.professionalId === idInformation.id) {
                  return this.prisma[key].delete({ where: { id: obj.id } })
                }
              }
            } else {
              const objWithId = { ...obj, professionalId: idInformation.id }
              const repeated = await this.prisma[key].findFirst({ where: { [Object.keys(obj)[0]]: objWithId[Object.keys(obj)[0]], AND: { professionalId: idInformation.id } } })
              if (!repeated) {
                return this.prisma[key].create({ data: { ...objWithId } })
              } else {
                return this.prisma[key].delete({ where: { id: repeated.id } })
              }
              /*               return { message: `Professional is already associated with that ${key} with the Id ${objWithId[Object.keys(obj)[0]]}` } */
            }
          })

          const promiseAttribute = await Promise.all(arrayAttribute)
          return { [key]: [...promiseAttribute] }
        }
      })

      const studyObj : object[] = []

      if (studies !== undefined && studies.length > 0) {
        const sameProfessional = await this.prisma.studies.findFirst({ where: { professionalId: idInformation.id } })

        if (sameProfessional) {
          studyObj.push(await this.prisma.studies.update({ where: { id: sameProfessional.id }, data: { ...studies[0] } }))
        } else {
          studyObj.push(await this.prisma.studies.create({ data: { ...studies[0], professionalId: idInformation.id } }))
        }
      }
      const promiseResolve = await Promise.all(updateReq)
      console.log(promiseResolve)
      promiseResolve.push({ studies: studyObj })
      /*       let orderedRequest : object = {}
      promiseResolve.map((item) => {
        if (item) { Object.entries(item).map(([key, values]) => { orderedRequest[key] = values }) }
      }) */
      const orderedRequest = await this.getProfessional({ id: idInformation.id })

      return { ...orderedRequest }
    }

    public async list () : Promise<ProfessionalInformations | object> {
      const listReq = await this.prisma.professionals.findMany({ include: { users: true, professionalFields: true, professionalForecasts: true, professionalInterventions: true, professionalModalities: true, professionalPaymentMethods: true, professionalSpecialties: true } })

      return listReq
    }

    public async listPatients (data : GetProfessional) : Promise<object> {
      const listAppointmentReq = await this.prisma.appointments.findMany({ where: { professionalId: data.id } })
      const userListReq = listAppointmentReq.map((appointment) => this.prisma.users.findUnique({ where: { id: appointment.userId }, select: { name: true, lastName: true, imageURL: true, birthDate: true, appointments: { select: { date: true } } } }))

      const promiseUserList = await Promise.all(userListReq)
      return promiseUserList
    }

    public async getProfessional (data : GetProfessional) : Promise<Professional | object> {
      const findReq = await this.prisma.professionals.findUnique({
        where: { id: data.id },
        include: {
          users: {
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
          },
          studies: true,
          appointments: true,
          professionalFields: true,
          professionalForecasts: true,
          professionalInterventions: true,
          professionalModalities: true,
          professionalPaymentMethods: true,
          professionalSpecialties: true
        }
      })

      if (!findReq) {
        throw new Error("Couldn't find a user with that Rut")
      }

      return findReq
    }
}

export default new ProfessionalModel()
