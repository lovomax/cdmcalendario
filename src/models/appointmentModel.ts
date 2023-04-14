import { PrismaClient } from '@prisma/client'
import { Appointment } from '../interfaces/appointments'

class AppointmentModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async store (data: Appointment) : Promise<Appointment> {
      const createReq = await this.prisma.appointments.create({ data: { ...data } })

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
