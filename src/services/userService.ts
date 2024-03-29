import { PrismaClient } from '@prisma/client'
import { GetUser, UserInformations, UserResponse, UserUpdateInformations } from '../interfaces/users'
import { messages, status } from '../utils/httpResponses'
import userModel from '../models/userModel'
import jwt, { Secret } from 'jsonwebtoken'

const { OK } = messages
const { FAILED, CREATED, DONE } = status
const SECRET_KEY : Secret = process.env.SECRET_KEY as string

class UserService {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    private objResponse (status : string, message : string, data : object) : UserResponse {
      return { status, message, data }
    }

    public async execute (payload : UserInformations) : Promise<UserResponse> {
      try {
        const createReq = await userModel.store(payload)
        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async logIn (payload : UserInformations) : Promise<UserResponse> {
      try {
        const foundUser = await userModel.logIn(payload)

        const token = jwt.sign({ id: foundUser, rut: foundUser.rut }, SECRET_KEY, { expiresIn: '7 days' })

        return this.objResponse(DONE, OK, { user: { ...foundUser }, token: token })
      } catch (err) {
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async list () : Promise<UserResponse> {
      try {
        const userList = await userModel.list()
        return this.objResponse(DONE, OK, userList)
      } catch (err) {
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async getUser (payload: GetUser) : Promise<UserResponse> {
      try {
        const user = await userModel.getUser(payload)
        return this.objResponse(DONE, OK, user)
      } catch (err) {
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async update (payload : UserUpdateInformations) : Promise<UserResponse> {
      try {
        const updateReq = await userModel.update(payload)
        return this.objResponse(CREATED, OK, updateReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async comissionGet () : Promise<UserResponse> {
      try {
        const createReq = await userModel.comissionGet()
        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async comissionCreate (payload : {userId: string, name: string, price: number}) : Promise<UserResponse> {
      try {
        const createReq = await userModel.comissionCreate(payload)
        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }
    public async comissionUpdate (payload : {userId: string, id: number, name: string, price: number}) : Promise<UserResponse> {
      try {
        const createReq = await userModel.comissionUpdate(payload)
        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }
    public async comissionDelete (payload : {userId: string, id: number}) : Promise<UserResponse> {
      try {
        const createReq = await userModel.comissionDelete(payload)
        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }
}

export default new UserService()
