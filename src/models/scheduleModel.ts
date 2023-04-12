import { PrismaClient } from '@prisma/client'
import { ScheduleInformations, Schedules } from '../interfaces/schedules'

class ScheduleModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    public async store (data : ScheduleInformations) : Promise<Schedules | object> {
      const { restDays, specialDays, specialSchedules, ...rest } = data
      const promiseReq : Promise<object>[] = []
      const SCHEDULE_LENGTH = 5
      var specialDay

      if (Object.keys(rest).length === SCHEDULE_LENGTH) {
        promiseReq.push(this.prisma.schedules.create({ data: { ...rest } }))
      }
      if (specialDays) {
        specialDay = await this.prisma.specialDays.create({ data: { ...specialDays } })
      }
      if (specialSchedules && specialDays !== undefined) {
        promiseReq.push(this.prisma.specialSchedules.create({ data: { ...specialSchedules, specialDayId: specialDay.id } }))
      }
      if (restDays.length) {
        const finder = await this.prisma.restDays.findMany({ where: { professionalId: restDays[0].professionalId }, select: { professionalId: true, dayOfWeek: true } })

        const filteredRest = restDays.filter((restDay) => !finder.find((finderRest) => finderRest.dayOfWeek === restDay.dayOfWeek))
        if (filteredRest.length) {
          promiseReq.push(this.prisma.restDays.createMany({ data: filteredRest }))
        }
      }

      if (!promiseReq.length && !specialDay) {
        throw new Error('No valid attributes were passed')
      }

      const createReq = await Promise.all(promiseReq)

      if (specialDay) {
        createReq.push(specialDay)
      }
      return createReq
    }
}

export default new ScheduleModel()
