import ScheduleService from '../services/scheduleService'
import { Request, Response } from 'express'
import { httpStatus } from '../utils/httpStatus'

class ScheduleController {
  public async store (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await ScheduleService.store(body)
    return res.status(httpStatus[service.status]).json(service)
  }
  public async update (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await ScheduleService.update(body)
    return res.status(httpStatus[service.status]).json(service)
  }
}

export default new ScheduleController()
