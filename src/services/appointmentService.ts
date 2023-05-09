import { PrismaClient } from '@prisma/client'
import { messages, status } from '../utils/httpResponses'
import { Appointment, AppointmentResponse, AppointmentUserInformation } from '../interfaces/appointments'
import appointmentModel from '../models/appointmentModel'

const { OK } = messages
const { FAILED, CREATED } = status

class AppointmentService {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    private objResponse (status : string, message : string, data : object) : AppointmentResponse {
      return { status, message, data }
    }

    public async list (payload: {id: number}) : Promise<AppointmentResponse> {
      try {
        const listReq = await appointmentModel.list(payload)

        return this.objResponse(CREATED, OK, listReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async store (payload : AppointmentUserInformation) : Promise<AppointmentResponse> {
      try {
        const createReq = await appointmentModel.store(payload)

        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async update (payload : Appointment) : Promise<AppointmentResponse> {
      try {
        const createReq = await appointmentModel.update(payload)

        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async delete (payload : Appointment) : Promise<AppointmentResponse> {
      try {
        const createReq = await appointmentModel.delete(payload)

        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        return this.objResponse(FAILED, OK, err)
      }
    }
}

export default new AppointmentService()
