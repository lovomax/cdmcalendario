import { PrismaClient } from '@prisma/client'
import { UserInformations, UserResponse } from '../interfaces/users'
import { messages, status } from '../utils/httpResponses'
import userModel from '../models/userModel'

const { OK } = messages
const { FAILED, CREATED } = status

class UserService {
    private prisma: PrismaClient

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
}

export default new UserService()
