import { PrismaClient } from '@prisma/client'
import { GetProfessional, Professional, ProfessionalInformations, Study } from '../interfaces/professionals'

class ProfessionalModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async store (data : ProfessionalInformations) : Promise<Professional | object> {
      const { studies: study, dateRangeStart, dateRangeEnd, userId, ...rest } = data
      try {
        const justOneStudy : Study = study[0]
        const dateCreate = { dateRangeStart, dateRangeEnd }
        const createReq = await this.prisma.professionals.create({
          data: {
            userId,
            studies: {
              create: {
                ...justOneStudy
              }
            },
            ...dateCreate
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

        const findReq = await this.getProfessional({ id: createReq.id })
        return { ...findReq }
      } catch (err) {
        console.log(err)
        throw new Error('Something failed while registering a new professional')
      }
    }

    public async update (data : ProfessionalInformations, idInformation : GetProfessional) : Promise<ProfessionalInformations| object> {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, studies, dateRangeStart, dateRangeEnd, ...rest } = data

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
      if (dateRangeStart || dateRangeEnd) {
        const updateDate = { dateRangeStart, dateRangeEnd }
        await this.prisma.professionals.update({ where: { id: idInformation.id },
          data: {
            ...updateDate
          } })
      }
      const promiseResolve = await Promise.all(updateReq)

      promiseResolve.push({ studies: studyObj })

      const orderedRequest = await this.getProfessional({ id: idInformation.id })

      return { ...orderedRequest }
    }

    public async listPagination (data: {
      cursor?: string,
      userAge?: number,
      take?: number,
      skip?: number,
      field?: number,
      specialty?: number,
      forecast?: number,
      modality?: number,
      service?: number,
      intervention?: number
     }) : Promise<ProfessionalInformations | object> {
      const takeSkipArgs = {
        take: data.take ? data.take : 5,
        skip: data.skip ? data.skip : 0
      }
      const queryArgs = {
        where: {
          AND: {
            ...(data.field && { professionalFields: { some: { specializedId: data.field } } }),
            ...(data.specialty && { professionalSpecialties: { some: { specializedId: data.specialty } } }),
            ...(data.forecast && { professionalForecasts: { some: { specializedId: data.forecast } } }),
            ...(data.modality && { professionalModalities: { some: { specializedId: data.modality } } }),
            ...(data.service && { professionalServices: { some: { specializedId: data.service } } }),
            ...(data.intervention && { professionalInterventions: { some: { specializedId: data.intervention } } }),
            ...(data.userAge && { dateRangeStart: { lte: data.userAge }, dateRangeEnd: { gte: data.userAge } }),
            schedules: {
              some: {}
            }
          }
        }
      }
      if (data.cursor) {
        const listReq = await this.prisma.professionals.findMany({
          cursor: { id: data.cursor },
          ...takeSkipArgs,
          ...queryArgs,
          include: {
            users: {
              select: {
                name: true,
                lastName: true,
                imageURL: true
              }
            }
          },
          orderBy: { id: 'desc' }
        })
        return listReq
      } else {
        const listReq = await this.prisma.professionals.findMany({
          ...takeSkipArgs,
          ...queryArgs,
          include: {
            users: {
              select: {
                name: true,
                lastName: true,
                imageURL: true
              }
            }
          },
          orderBy: { id: 'desc' }
        })
        return listReq
      }
    }

    public async list () : Promise<ProfessionalInformations | object> {
      const listReq = await this.prisma.professionals.findMany({
        include: {
          users: {
            select: {
              name: true,
              lastName: true,
              birthDate: true,
              email: true,
              imageURL: true,
              phoneNumbers: true,
              whatsAppNumbers: true
            }
          },
          professionalFields: true,
          professionalForecasts: true,
          professionalInterventions: true,
          professionalModalities: true,
          professionalPaymentMethods: true,
          professionalSpecialties: true,
          professionalServices: true
        }
      })
      return listReq
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
          professionalFields: true,
          professionalForecasts: true,
          professionalInterventions: true,
          professionalModalities: true,
          professionalPaymentMethods: true,
          professionalSpecialties: true,
          professionalServices: true
        }
      })

      if (!findReq) {
        throw new Error("Couldn't find a user with that Rut")
      }

      return findReq
    }
}

export default new ProfessionalModel()
