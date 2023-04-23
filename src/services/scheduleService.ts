import { PrismaClient } from '@prisma/client'
import { messages, status } from '../utils/httpResponses'
import scheduleModel from '../models/scheduleModel'
import { GetSchedule, GetSpecialHour, ScheduleInformations, ScheduleResponse } from '../interfaces/schedules'

const { OK } = messages
const { FAILED, CREATED, DONE } = status

class ScheduleService {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    private objResponse (status: string, message: string, data: object) : ScheduleResponse {
      return { status, message, data }
    }

    public async list (payload : GetSchedule) : Promise<ScheduleResponse> {
      try {
        const createReq = await scheduleModel.list(payload)
        return this.objResponse(DONE, OK, createReq)
      } catch (err) {
        return this.objResponse(FAILED, OK, err.message)
      }
    }

    public async listSpecialHour (payload : GetSpecialHour) : Promise<ScheduleResponse> {
      try {
        const createReq = await scheduleModel.listSpecialHour(payload)
        return this.objResponse(DONE, OK, createReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async listAllSchedules (payload : GetSchedule) : Promise<ScheduleResponse> {
      try {
        const createReq = await scheduleModel.listAllSchedules(payload)
        return this.objResponse(DONE, OK, createReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err.message)
      }
    }

    public async store (payload : ScheduleInformations) : Promise<ScheduleResponse> {
      try {
        const createReq = await scheduleModel.store(payload)
        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        return this.objResponse(FAILED, OK, err.message)
      }
    }
    public async update (payload : ScheduleInformations) : Promise<ScheduleResponse> {
      try {
        const createReq = await scheduleModel.update(payload)
        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        return this.objResponse(FAILED, OK, err.message)
      }
    }
}

export default new ScheduleService()
