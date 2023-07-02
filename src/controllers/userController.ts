import UserService from '../services/userService'
import { Request, Response } from 'express'
import { httpStatus } from '../utils/httpStatus'

class UserController {
  public async store (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await UserService.execute(body)
    return res.status(httpStatus[service.status]).json(service)
  }
  public async logIn (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const service = await UserService.logIn(body)
    return res.status(httpStatus[service.status]).json(service)
  }
  public async list (req: Request, res: Response) : Promise<Response> {
    const service = await UserService.list()

    return res.status(httpStatus[service.status]).json(service)
  }
  public async getUser (req: Request, res: Response) : Promise<Response> {
    const userId = req.params.id
    const service = await UserService.getUser({ id: userId })
    return res.status(httpStatus[service.status]).json(service)
  }
  public async update (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const userId = req.params.id
    const bodyReq = { ...body, id: userId }
    const service = await UserService.update(bodyReq)
    return res.status(httpStatus[service.status]).json(service)
  }
  public async comissionGet (req: Request, res: Response) : Promise<Response> {
    const service = await UserService.comissionGet()
    return res.status(httpStatus[service.status]).json(service)
  }
  public async comissionCreate (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const userId = req.params.id
    const bodyReq = { ...body, userId: userId }
    const service = await UserService.comissionCreate(bodyReq)
    return res.status(httpStatus[service.status]).json(service)
  }
  public async comissionUpdate (req: Request, res: Response) : Promise<Response> {
    const { body } = req
    const userId = req.params.id
    const id = req.params.cid
    const bodyReq = { ...body, id: id, userId: userId }
    const service = await UserService.comissionUpdate(bodyReq)
    return res.status(httpStatus[service.status]).json(service)
  }
  public async comissionDelete (req: Request, res: Response) : Promise<Response> {
    const userId = req.params.id
    const id = req.params.cid
    const bodyReq = { id: id, userId: userId }
    const service = await UserService.comissionDelete(bodyReq)
    return res.status(httpStatus[service.status]).json(service)
  }
}

export default new UserController()
