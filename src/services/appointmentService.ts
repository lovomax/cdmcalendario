import { PrismaClient } from '@prisma/client'
import { messages, status } from '../utils/httpResponses'
import { Appointment, AppointmentProfessional, AppointmentResponse, AppointmentUpdate, AppointmentUserInformation } from '../interfaces/appointments'
import appointmentModel from '../models/appointmentModel'
import { GetProfessional } from '../interfaces/professionals'

const { OK } = messages
const { FAILED, CREATED, DONE } = status

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

    public async listPatients (payload : GetProfessional) : Promise<AppointmentResponse> {
      try {
        const listReq = await appointmentModel.listPatients(payload)

        return this.objResponse(DONE, OK, listReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async listRegisters (payload: {id: string, startDate: Date, endDate: Date}) : Promise<AppointmentResponse> {
      try {
        const listReq = await appointmentModel.listRegisters(payload)

        return this.objResponse(DONE, OK, listReq)
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
    public async createProfessionalAppointment (payload : AppointmentProfessional) : Promise<AppointmentResponse> {
      try {
        const createReq = await appointmentModel.createProfessionalAppointment(payload)

        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async update (payload : AppointmentUpdate) : Promise<AppointmentResponse> {
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
