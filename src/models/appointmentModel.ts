import { PrismaClient } from '@prisma/client'
import { Appointment, AppointmentProfessional, AppointmentUpdate, AppointmentUserInformation } from '../interfaces/appointments'
import userModel from './userModel'
import { GetProfessional } from '../interfaces/professionals'

class AppointmentModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async list (data: {id: number}) : Promise<Appointment | object> {
      const listAppointmentReq = await this.prisma.appointments.findUnique({ where: { id: data.id } })

      return { ...listAppointmentReq }
    }

    public async getSessionNumber (data: {professionalId: string, userId: string}) : Promise<Appointment | object> {
      const listAppointment = await this.prisma.appointments.findMany({
        where: {
          AND: {
            professionalId: data.professionalId,
            userId: data.userId,
            AND: [
              { state: { not: 'PENDING' } },
              { state: { not: 'CANCELED' } }
            ]

          }
        }
      })
      if (listAppointment instanceof Array) {
        return { totalSessionNumber: listAppointment.length }
      }

      return { totalSessionNumber: 0 }
    }

    public async listPatients (data : GetProfessional) : Promise<object> {
      const listAppointmentReq = await this.prisma.appointments.findMany({
        where: { professionalId: data.id },
        select: {
          id: true,
          professionalId: true,
          date: true,
          users: {
            select: {
              rut: true,
              imageURL: true,
              name: true,
              lastName: true,
              phoneNumbers: { where: { roleOfNumber: 'USER' }, select: { number: true } },
              whatsAppNumbers: { where: { roleOfNumber: 'USER' }, select: { number: true } },
              email: true } } } })

      return listAppointmentReq
    }

    public async findAllPatients (data : {id: string, searchString?: string}) : Promise<object> {
      const verify = await this.prisma.users.findUniqueOrThrow({ where: { id: data.id } })
      if (verify.roleOfUser !== 'ADMIN') {
        throw Error('Unathorized access')
      }

      let dividedString = ''
      if (data.searchString) {
        dividedString = data.searchString.toLocaleLowerCase().replace(' ', ' | ')
      }
      const listAppointmentReq = await this.prisma.appointments.findMany({
        distinct: ['userId'],
        where: { users: { AND: { name: { search: dividedString }, lastName: { search: dividedString } } } },
        select: {
          id: true,
          professionalId: true,
          users: {
            select: {
              rut: true,
              imageURL: true,
              name: true,
              lastName: true } } } })

      return listAppointmentReq
    }

    public async findPatients (data : {id: string, searchString?: string, userRut?: string}) : Promise<object> {
      let dividedString = ''
      if (data.searchString) {
        dividedString = data.searchString.toLocaleLowerCase()
      }
      /*       const listAppointment = await this.prisma.$queryRaw`SELECT a.id, a.professionalId, a.userId, u.rut, u.imageURL, u.name, u.lastName DISTINCT a.userId FROM appointments a, users u WHERE ` */
      const listAppointmentReq = await this.prisma.appointments.findMany({
        distinct: ['userId'],
        where: { professionalId: data.id, users: { AND: { fullName: { contains: dividedString } } } },
        select: {
          id: true,
          professionalId: true,
          users: {
            select: {
              rut: true,
              imageURL: true,
              name: true,
              lastName: true
            }
          }
        }
      })

      return listAppointmentReq
    }

    public async listAllPatients (data : {id: string}) : Promise<object> {
      const verify = await this.prisma.users.findUniqueOrThrow({ where: { id: data.id } })
      if (verify.roleOfUser !== 'ADMIN') {
        throw Error('Unauthorized entry')
      }
      const listAppointmentReq = await this.prisma.appointments.findMany({
        distinct: ['userId'],
        select: {
          id: true,
          professionalId: true,
          date: true,
          users: {
            select: {
              rut: true,
              imageURL: true,
              name: true,
              lastName: true,
              phoneNumbers: { where: { roleOfNumber: 'USER' }, select: { number: true } },
              whatsAppNumbers: { where: { roleOfNumber: 'USER' }, select: { number: true } },
              email: true } } } })

      return listAppointmentReq
    }

    public async listAllRegisters (data: {id: string, startDate: Date, endDate: Date, userRut?: string}) : Promise<object> {
      const verify = await this.prisma.users.findUniqueOrThrow({ where: { id: data.id } })
      if (verify.roleOfUser === 'ADMIN') {
        const listAppointmentReq = await this.prisma.appointments.findMany({
          where: { ...(data.userRut && { users: { rut: { equals: data.userRut } } }), date: { lte: data.endDate, gte: data.startDate } },
          select: {
            id: true,
            professionalId: true,
            date: true,
            state: true,
            sessionNumber: true,
            observation: true,
            chosenField: true,
            chosenForecast: true,
            chosenIntervention: true,
            chosenModality: true,
            chosenPaymentMethod: true,
            chosenSpecialty: true,
            chosenService: true,
            users: {
              select: {
                id: true,
                name: true,
                lastName: true,
                phoneNumbers: { where: { roleOfNumber: 'USER' }, select: { number: true } },
                whatsAppNumbers: { where: { roleOfNumber: 'USER' }, select: { number: true } },
                email: true }
            },
            professionals: {
              select: {
                users: {
                  select: {
                    name: true,
                    lastName: true,
                    email: true
                  }
                }
              }
            }
          },
          orderBy: {
            date: 'asc'
          }
        })
        const countAppointment = await this.prisma.appointments.count({
          where: {
            AND: {
              ...(data.userRut && {
                users: {
                  rut: {
                    equals: data.userRut
                  }
                }
              }),
              date: { lte: data.endDate, gte: data.startDate } } }
        })
        return { appointments: listAppointmentReq, count: countAppointment }
      }
      throw Error('Unauthorized entry')
    }

    public async listRegisters (data: {id: string, startDate: Date, endDate: Date, userRut?: string}) : Promise<object> {
      const listAppointmentReq = await this.prisma.appointments.findMany({
        where: { AND: { professionalId: data.id, ...(data.userRut && { users: { rut: { equals: data.userRut } } }), date: { lte: data.endDate, gte: data.startDate } } },
        select: {
          id: true,
          professionalId: true,
          date: true,
          state: true,
          sessionNumber: true,
          observation: true,
          chosenField: true,
          chosenForecast: true,
          chosenIntervention: true,
          chosenModality: true,
          chosenPaymentMethod: true,
          chosenSpecialty: true,
          chosenService: true,
          users: {
            select: {
              id: true,
              name: true,
              lastName: true,
              phoneNumbers: { where: { roleOfNumber: 'USER' }, select: { number: true } },
              whatsAppNumbers: { where: { roleOfNumber: 'USER' }, select: { number: true } },
              email: true }
          }
        },
        orderBy: {
          date: 'asc'
        }
      })

      const countAppointment = await this.prisma.appointments.count({
        where: {
          AND: {
            professionalId: data.id,
            ...(data.userRut && {
              users: {
                rut: {
                  equals: data.userRut
                }
              }
            }),
            date: { lte: data.endDate, gte: data.startDate } } }
      })
      return { appointments: listAppointmentReq, count: countAppointment }
    }

    public async store (data: AppointmentUserInformation) : Promise<Appointment | object> {
      const { birthDate, email, rut, name, lastName, phoneNumbers, whatsAppNumbers, ...rest } = data
      const userPayload = {
        name: name,
        lastName: lastName,
        ...(birthDate && { birthDate: birthDate }),
        ...(email && { email: email }),
        ...(rut && { rut: rut }),
        phoneNumbers: phoneNumbers,
        whatsAppNumbers: whatsAppNumbers
      }
      rest.date = new Date(rest.date)
      if (data.userId) {
        const createReq = await this.prisma.appointments.create({ data: { ...rest } })
        return createReq
      } else {
        const userCreateReq = await userModel.store(userPayload)
        if (userCreateReq[0].id) {
          const createAppointmentReq = await this.prisma.appointments.create({ data: { ...rest, userId: userCreateReq[0].id } })
          return createAppointmentReq
        }
      }
      return {}
    }

    public async createProfessionalAppointment (data : AppointmentProfessional) : Promise<Appointment> {
      const createReq = await this.prisma.appointments.create({
        data: {
          ...data
        }
      })

      return createReq
    }

    public async update (data: AppointmentUpdate) : Promise<Appointment> {
      data.date = new Date(data.date)
      const updateReq = await this.prisma.appointments.update({ where: { id: data.id },
        data: {
          id: data.id,
          date: data.date,
          state: data.state,
          sessionNumber: data.sessionNumber,
          observation: data.observation,
          chosenField: data.chosenField,
          chosenForecast: data.chosenForecast,
          chosenIntervention: data.chosenIntervention,
          chosenModality: data.chosenModality,
          chosenPaymentMethod: data.chosenPaymentMethod,
          chosenService: data.chosenSpecialty,
          chosenSpecialty: data.chosenSpecialty
        } })

      return updateReq
    }
    public async delete (data : Appointment) : Promise<Appointment> {
      const deleteReq = await this.prisma.appointments.delete({ where: { id: data.id } })

      return deleteReq
    }
}

export default new AppointmentModel()
