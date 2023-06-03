import { Request, Response } from 'express'
import { httpStatus } from '../utils/httpStatus'
import professionalService from '../services/professionalService'

class ProfessionalController {
  public async store (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const params = { id: req.params.id }
    const service = await professionalService.store({ ...body, userId: params.id })
    return res.status(httpStatus[service.status]).json(service)
  }
  public async update (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const userId = { id: req.params.id }
    const service = await professionalService.update(body, userId)
    return res.status(httpStatus[service.status]).json(service)
  }
  public async listPagination (req: Request, res: Response) : Promise<Response> {
    const payload = {
      cursor: req.query.c,
      userAge: req.query.ua && Number(req.query.ua),
      take: Number(req.query.t),
      skip: req.query.sk ? Number(req.query.sk) : 0,
      field: Number(req.query.fi),
      specialty: Number(req.query.sp),
      forecast: Number(req.query.fo),
      modality: Number(req.query.mo),
      service: Number(req.query.se),
      intervention: Number(req.query.in)
    }
    const service = await professionalService.listPagination(payload)
    return res.status(httpStatus[service.status]).json(service)
  }
  public async list (req: Request, res: Response) : Promise<Response> {
    const service = await professionalService.list()
    return res.status(httpStatus[service.status]).json(service)
  }
  public async getProfessional (req: Request, res: Response) : Promise<Response> {
    const professionalId = { id: req.params.id }
    const service = await professionalService.getProfessional(professionalId)
    return res.status(httpStatus[service.status]).json(service)
  }
}

export default new ProfessionalController()
