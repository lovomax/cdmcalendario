import { PrismaClient } from '@prisma/client'
import { Professional, ProfessionalInformations } from '../interfaces/professionals'

class ProfessionalModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async store (data : ProfessionalInformations) : Promise<Professional | object> {
      const { study, professionalFields, professionalForecasts, professionalInterventions, professionalModalities, professionalPaymentMethods, professionalSpecialties, userId } = data
      const createReq = await this.prisma.professionals.create({
        data: {
          userId,
          studies: {
            create: {
              ...study
            }
          },
          professionalFields: {
            create: {
              ...professionalFields
            }
          },
          professionalForecasts: {
            create: {
              ...professionalForecasts
            }
          },
          professionalInterventions: {
            create: {
              ...professionalInterventions
            }
          },
          professionalModalities: {
            create: {
              ...professionalModalities
            }
          },
          professionalPaymentMethods: {
            create: {
              ...professionalPaymentMethods
            }
          },
          professionalSpecialties: {
            create: {
              ...professionalSpecialties
            }
          }
        }
      })

      return createReq
    }
}

export default new ProfessionalModel()
