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
}

export default new UserController()
