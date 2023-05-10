import { PrismaClient } from '@prisma/client'
import { messages, status } from '../utils/httpResponses'
import professionalModel from '../models/professionalModel'
import { GetProfessional, ProfessionalInformations, ProfessionalResponse } from '../interfaces/professionals'

const { OK } = messages
const { FAILED, CREATED, DONE } = status

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

    public async update (payload : ProfessionalInformations, id: GetProfessional) : Promise<ProfessionalResponse> {
      try {
        const updateReq = await professionalModel.update(payload, id)

        return this.objResponse(CREATED, OK, updateReq)
      } catch (err) {
        console.log(err)
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async list () : Promise<ProfessionalResponse> {
      try {
        const listReq = await professionalModel.list()

        return this.objResponse(DONE, OK, listReq)
      } catch (err) {
        return this.objResponse(FAILED, OK, err)
      }
    }

    public async getProfessional (payload : GetProfessional) : Promise<ProfessionalResponse> {
      try {
        const findReq = await professionalModel.getProfessional(payload)

        return this.objResponse(DONE, OK, findReq)
      } catch (err) {
        return this.objResponse(FAILED, OK, err)
      }
    }
}

export default new ProfessionalService()
