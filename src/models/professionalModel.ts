import { PrismaClient } from '@prisma/client'
import { GetPaginationProfessional, GetProfessional, InitialStudies, Professional, ProfessionalInformations } from '../interfaces/professionals'

class ProfessionalModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async store (data : ProfessionalInformations) : Promise<Professional | object> {
      const { studies: study, dateRangeStart, dateRangeEnd, userId, servicePrices, ...rest } = data
      try {
        const studies : InitialStudies[] = study
        const dateCreate = { dateRangeStart, dateRangeEnd }
        const createReq = await this.prisma.professionals.create({
          data: {
            userId,
            studies: {
              createMany: { data: studies }
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

        await this.prisma.servicePrices.createMany({ data: servicePrices })

        const findReq = await this.getProfessional({ id: createReq.id })
        return { ...findReq }
      } catch (err) {
        console.log(err)
        throw new Error('Something failed while registering a new professional')
      }
    }

    public async update (data : ProfessionalInformations, idInformation : GetProfessional) : Promise<ProfessionalInformations| object> {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, studies, dateRangeStart, dateRangeEnd, servicePrices, ...rest } = data
      const updateReq = Object.entries(rest).map(async ([key, value]) => {
        if (value) {
          const arrayAttribute = value.map(async (obj) => {
            if (obj.id) {
              const sameProfessional = await this.prisma[key].findFirst({ where: { id: obj.id } })
              if (sameProfessional) {
                if (sameProfessional.professionalId === idInformation.id) {
                  const { toDelete } = obj
                  if (toDelete) {
                    return this.prisma[key].delete({ where: { id: obj.id } })
                  }
                }
              }
            } else {
              const { toDelete, ...rest } = obj
              const objWithId = { ...rest, professionalId: idInformation.id }
              const repeated = await this.prisma[key].findFirst({ where: { [Object.keys(obj)[0]]: objWithId[Object.keys(obj)[0]], AND: { professionalId: idInformation.id } } })
              if (!toDelete || !repeated) {
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
      const promiseResolve = await Promise.all(updateReq)
      const serviceObj : object[] = []
      if (servicePrices) {
        servicePrices.forEach(async (obj) => {
          if (obj.id) {
            serviceObj.push(this.prisma.servicePrices.update({ where: { id: obj.id }, data: { ...obj } }))
          } else if (obj.serviceId && obj.forecastId) {
            const { serviceId, ...prices } = obj
            const foundService = await this.prisma.professionalServices.findFirst({ where: { id: serviceId, professionalId: idInformation.id } })
            if (foundService && prices.price) {
              serviceObj.push(this.prisma.professionalServices.update({ where: { id: serviceId }, data: { servicePrices: { create: { ...prices } } } }))
            }
          } else if (obj.forecastSpecializedId && obj.serviceSpecializedId && obj.price) {
            const forecast = await this.prisma.professionalForecasts.findFirst({ where: { specializedId: obj.forecastSpecializedId, professionalId: idInformation.id }, select: { id: true } })
            const service = await this.prisma.professionalServices.findFirst({ where: { specializedId: obj.serviceSpecializedId, professionalId: idInformation.id }, select: { id: true } })
            if (forecast && service) {
              serviceObj.push(this.prisma.servicePrices.create({ data: { ...obj, forecastId: forecast.id, serviceId: service.id } }))
            }
          }
        })
      }

      const studyObj : object[] = []
      const studiesReq : object[] = []

      if (studies !== undefined && studies.length > 0) {
        const studiesToDelete : number[] = []
        studies.forEach((study) => {
          if (study.toDelete) {
            studiesToDelete.push(study.id)
          }
        })
        const restOfStudies = studies.filter((study) => !study.toDelete)
        const sameProfessional = await this.prisma.studies.findFirst({ where: { professionalId: idInformation.id } })
        if (sameProfessional) {
          if (studiesToDelete) {
            studyObj.push(await this.prisma.studies.deleteMany({ where: { id: { in: studiesToDelete } } }))
          }
          restOfStudies.forEach((study) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { toDelete, ...rest } = study
            if (study.id) {
              studiesReq.push(this.prisma.studies.update({ where: { id: study.id }, data: rest }))
            } else {
              studiesReq.push(this.prisma.studies.create({ data: rest }))
            }
          })
        }
      }
      if (dateRangeStart || dateRangeEnd) {
        const updateDate = { dateRangeStart, dateRangeEnd }
        await this.prisma.professionals.update({ where: { id: idInformation.id },
          data: {
            ...updateDate
          } })
      }

      await Promise.all(serviceObj)
      if (studiesReq.length) {
        await Promise.all(studiesReq)
      }
      promiseResolve.push({ studies: studyObj })

      const orderedRequest = await this.getProfessional({ id: idInformation.id })

      return { ...orderedRequest }
    }

    public async listPagination (data : GetPaginationProfessional) : Promise<ProfessionalInformations | object> {
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
            },
            professionalServices: {
              some: {
                servicePrices: { some: {} }
              }
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
              whatsAppNumbers: true,
              roleOfUser: true
            }
          },
          studies: true,
          professionalFields: true,
          professionalForecasts: true,
          professionalInterventions: true,
          professionalModalities: true,
          professionalPaymentMethods: true,
          professionalSpecialties: true,
          professionalServices: { include: { servicePrices: true } }
        }
      })

      if (!findReq) {
        throw new Error("Couldn't find a user with that Rut")
      }

      return findReq
    }

    public async getCredits (data: {id: string}) : Promise <object> {
      const findReq = await this.prisma.professionalCredits.findUniqueOrThrow({ where: { professionalId: data.id }, select: { credits: true } })

      return findReq
    }

    public async getAllCredits (data : {userId: string}) : Promise <object> {
      const admin = await this.prisma.users.findUniqueOrThrow({ where: { id: data.userId } })
      if (admin.roleOfUser !== 'ADMIN') {
        throw Error()
      }

      const findProfessionals = await this.prisma.professionals.findMany({ select: {
        id: true,
        users: { select: {
          fullName: true,
          imageURL: true
        } },
        professionalCredits: true
      } })

      return findProfessionals
    }

    public async updateCredits (data : {professionalId: string, userId: string, amount: number}) : Promise <object> {
      const admin = await this.prisma.users.findUniqueOrThrow({ where: { id: data.userId } })
      if (admin.roleOfUser !== 'ADMIN') {
        throw Error()
      }

      const updateReq = await this.prisma.professionalCredits.update({ where: { professionalId: data.professionalId }, data: { credits: data.amount } })
      return updateReq
    }

    public async createCredits (data : {professionalId: string, userId: string, amount: number}) : Promise <object> {
      const admin = await this.prisma.users.findUniqueOrThrow({ where: { id: data.userId } })
      if (admin.roleOfUser !== 'ADMIN') {
        throw Error()
      }

      const updateReq = await this.prisma.professionalCredits.create({ data: { professionalId: data.professionalId, credits: data.amount } })
      return updateReq
    }
}

export default new ProfessionalModel()
