import { PrismaClient } from '@prisma/client'
import { messages, status } from '../utils/httpResponses'
import professionalModel from '../models/professionalModel'
import { ProfessionalInformations, ProfessionalResponse } from '../interfaces/professionals'

const { OK } = messages
const { FAILED, CREATED } = status

class ProfessionalService {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    private objResponse (status : string, message : string, data : object) : ProfessionalResponse {
      return { status, message, data }
    }

    public async store (payload : ProfessionalInformations) : Promise<ProfessionalResponse> {
      try {
        const createReq = await professionalModel.store(payload)

        return this.objResponse(CREATED, OK, createReq)
      } catch (err) {
        return this.objResponse(FAILED, OK, err)
      }
    }
}

export default new ProfessionalService()
