import { PrismaClient } from '@prisma/client'
import { Appointment, AppointmentProfessional, AppointmentUserInformation } from '../interfaces/appointments'
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

    public async listRegisters (data: {id: string, startDate: Date, endDate: Date}) : Promise<object> {
      const listAppointmentReq = await this.prisma.appointments.findMany({
        where: { AND: { professionalId: data.id, date: { lte: data.endDate, gte: data.startDate } } },
        select: {
          id: true,
          professionalId: true,
          date: true,
          state: true,
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
      return listAppointmentReq
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
      console.log(data)
      /*       const { userId, ...rest } = data */
      /*       const user = await this.prisma.users.findFirstOrThrow({ where: { rut: rut }, select: { id: true } }) */
      const createReq = await this.prisma.appointments.create({
        data: {
          ...data
        }
      })

      return createReq
    }

    public async update (data: Appointment) : Promise<Appointment> {
      const updateReq = await this.prisma.appointments.update({ where: { id: data.id }, data: { ...data } })

      return updateReq
    }
    public async delete (data : Appointment) : Promise<Appointment> {
      const deleteReq = await this.prisma.appointments.delete({ where: { id: data.id } })

      return deleteReq
    }
}

export default new AppointmentModel()
