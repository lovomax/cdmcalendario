import { Request, Response } from 'express'
import { httpStatus } from '../utils/httpStatus'
import professionalService from '../services/professionalService'

class ProfessionalController {
  public async store (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await professionalService.store(body)
    return res.status(httpStatus[service.status]).json(service)
  }
  public async update (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const userId = { id: req.params.id }
    const service = await professionalService.update(body, userId)
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
  public async listPatients (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await professionalService.listPatients(body)
    return res.status(httpStatus[service.status]).json(service)
  }
}

export default new ProfessionalController()
