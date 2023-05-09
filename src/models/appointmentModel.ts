import { PrismaClient } from '@prisma/client'
import { Appointment, AppointmentUserInformation } from '../interfaces/appointments'
import userModel from './userModel'

class AppointmentModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async list (data: {id: number}) : Promise<Appointment | object> {
      const listAppointmentReq = await this.prisma.appointments.findUnique({ where: { id: data.id } })

      return { ...listAppointmentReq }
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
