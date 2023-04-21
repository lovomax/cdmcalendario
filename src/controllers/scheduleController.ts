import ScheduleService from '../services/scheduleService'
import { Request, Response } from 'express'
import { httpStatus } from '../utils/httpStatus'

class ScheduleController {
  public async list (req: Request, res: Response) : Promise<Response> {
    const professionalId = { professionalId: req.params.id }
    const service = await ScheduleService.list(professionalId)
    return res.status(httpStatus[service.status]).json(service)
  }
  public async store (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const params = { professionalId: req.params.id }
    const service = await ScheduleService.store({ ...body, professionalId: params.professionalId })
    return res.status(httpStatus[service.status]).json(service)
  }
  public async update (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const params = { professionalId: req.params.id }
    const service = await ScheduleService.update({ ...body, professionalId: params.professionalId })
    return res.status(httpStatus[service.status]).json(service)
  }
}

export default new ScheduleController()
