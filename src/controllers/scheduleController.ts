import ScheduleService from '../services/scheduleService'
import { Request, Response } from 'express'
import { httpStatus } from '../utils/httpStatus'

class ScheduleController {
  public async list (req: Request, res: Response) : Promise<Response> {
    const params = { professionalId: req.params.id, monthDate: new Date(req.params.date) }

    const service = await ScheduleService.list({ ...params })
    return res.status(httpStatus[service.status]).json(service)
  }
  public async listSpecialHour (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await ScheduleService.listSpecialHour({ ...body })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async listAllSchedules (req: Request, res: Response) : Promise<Response> {
    const params = { professionalId: req.params.id }

    const service = await ScheduleService.listAllSchedules({ professionalId: params.professionalId, monthDate: new Date() })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async createSchedule (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const params = { professionalId: req.params.id }
    const service = await ScheduleService.createSchedule({ ...body, professionalId: params.professionalId })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async updateSchedule (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const params = { professionalId: req.params.id }
    const service = await ScheduleService.updateSchedule({ ...body, professionalId: params.professionalId })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async deleteSchedule (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const params = { professionalId: req.params.id }
    const service = await ScheduleService.deleteSchedule({ ...body, professionalId: params.professionalId })
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
