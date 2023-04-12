import { PrismaClient } from '@prisma/client'
import { Professional, ProfessionalInformations, ProfessionalUpdateInformations } from '../interfaces/professionals'

class ProfessionalModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async store (data : ProfessionalInformations) : Promise<Professional | object> {
      const { study, userId, ...rest } = data
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

    public async update (data : ProfessionalUpdateInformations) : Promise<ProfessionalInformations| object> {
      const { professionalId, ...rest } = data

      const updateReq = Object.entries(rest).map(([key, value]) => {
        if (value) {
          const arrayAttribute = value.map(async (obj) => {
            if (obj.id) {
              const sameProfessional = await this.prisma[key].findFirst({ where: { id: obj.id } })
              if (sameProfessional.professionalId === professionalId) {
                return this.prisma[key].delete({ where: { id: obj.id } })
              }
              return { message: `Unathorized attempt to delete an entry` }
            } else {
              const objWithId = { ...obj, professionalId: professionalId }
              const repeated = await this.prisma[key].findFirst({ where: { fieldId: objWithId.fieldId } })
              if (repeated.length) {
                return this.prisma[key].create({ data: { ...objWithId } })
              }
              return { message: `Professional is already associated with that ${key} with the Id ${objWithId.fieldId}` }
            }
          })

          return arrayAttribute
        }
      }).flat().filter((element) => element !== undefined)

      const arrayPromise = await Promise.all(updateReq)
      return arrayPromise
    }

    public async list () : Promise<ProfessionalInformations | object> {
      const listReq = await this.prisma.professionals.findMany({ include: { users: true, professionalFields: true, professionalForecasts: true, professionalInterventions: true, professionalModalities: true, professionalPaymentMethods: true, professionalSpecialties: true } })

      return listReq
    }
}

export default new ProfessionalModel()
