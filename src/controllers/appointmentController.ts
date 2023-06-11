import { Request, Response } from 'express'
import { httpStatus } from '../utils/httpStatus'
import appointmentService from '../services/appointmentService'

class AppointmentController {
  public async list (req: Request, res: Response) : Promise<Response> {
    const params = { id: parseInt(req.params.id) }
    const service = await appointmentService.list(params)

    return res.status(httpStatus[service.status]).json(service)
  }

  public async getSessionNumber (req: Request, res: Response) : Promise<Response> {
    const service = await appointmentService.getSessionNumber({ professionalId: req.params.pid, userId: req.params.uid })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async listPatients (req: Request, res: Response) : Promise<Response> {
    const service = await appointmentService.listPatients({ id: req.params.id })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async findPatients (req: Request, res: Response) : Promise<Response> {
    const service = await appointmentService.findPatients({ id: req.params.id, searchString: req.query.ps })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async findAllPatients (req: Request, res: Response) : Promise<Response> {
    const service = await appointmentService.findAllPatients({ id: req.params.id, searchString: req.query.ps })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async listAllRegisters (req: Request, res: Response) : Promise<Response> {
    const service = await appointmentService.listAllRegisters({ id: req.params.id, startDate: new Date(req.params.start), endDate: new Date(req.params.end), userRut: req.query.ru })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async listRegisters (req: Request, res: Response) : Promise<Response> {
    const service = await appointmentService.listRegisters({ id: req.params.id, startDate: new Date(req.params.start), endDate: new Date(req.params.end), userRut: req.query.ru })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async store (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const params = { professionalId: req.params.id }
    const service = await appointmentService.store({ ...body, professionalId: params.professionalId })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async appointmentProfessional (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await appointmentService.createProfessionalAppointment({ ...body })
    return res.status(httpStatus[service.status]).json(service)
  }

  public async update (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await appointmentService.update(body)
    return res.status(httpStatus[service.status]).json(service)
  }

  public async delete (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await appointmentService.delete(body)
    return res.status(httpStatus[service.status]).json(service)
  }
}

export default new AppointmentController()
