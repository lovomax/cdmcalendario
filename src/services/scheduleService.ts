import { PrismaClient } from '@prisma/client'
import { messages, status } from '../utils/httpResponses'
import scheduleModel from '../models/scheduleModel'
import { ScheduleInformations, ScheduleResponse } from '../interfaces/schedules'

const { OK } = messages
const { FAILED, CREATED } = status

class ScheduleService {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    private objResponse (status: string, message: string, data: object) : ScheduleResponse {
      return { status, message, data }
    }

    public async store (payload : ScheduleInformations) : Promise<ScheduleResponse> {
      try {
        const createReq = await scheduleModel.store(payload)
        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        return this.objResponse(FAILED, OK, err.message)
      }
    }
}

export default new ScheduleService()