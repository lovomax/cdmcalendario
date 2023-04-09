import { Request, Response } from 'express'
import { httpStatus } from '../utils/httpStatus'
import professionalService from '../services/professionalService'

class ProfessionalController {
  public async store (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await professionalService.store(body)
    return res.status(httpStatus[service.status]).json(service)
  }
}

export default new ProfessionalController()
