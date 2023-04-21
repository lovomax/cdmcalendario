import { PrismaClient } from '@prisma/client'
import { Appointment, AppointmentUserInformation } from '../interfaces/appointments'
import userModel from './userModel'

class AppointmentModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async store (data: AppointmentUserInformation) : Promise<Appointment | object> {
      const userPayload = {
        name: data.name,
        lastName: data.lastName,
        ...(data.birthDate && { birthDate: data.birthDate }),
        ...(data.email && { email: data.email }),
        ...(data.rut && { rut: data.rut }),
        phoneNumbers: data.phoneNumbers,
        whatsAppNumbers: data.whatsAppNumbers
      }

      if (data.userId) {
        const createReq = await this.prisma.appointments.create({ data: { userId: data.userId, professionalId: data.professionalId, date: new Date(data.date) } })
        return createReq
      } else {
        const userCreateReq = await userModel.store(userPayload)
        if (userCreateReq[0].id) {
          const createAppointmentReq = await this.prisma.appointments.create({ data: { ...data, userId: userCreateReq[0].id } })
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
