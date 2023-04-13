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

    public async update (data : ScheduleInformations) : Promise<Schedules | object> {
      const { restDays, specialDays, specialSchedules, ...rest } = data
      const promiseReq : Promise<object>[] = []
      const SCHEDULE_LENGTH = 5
      var specialDay
      var restPromise

      if (Object.keys(rest).length === SCHEDULE_LENGTH) {
        promiseReq.push(this.prisma.schedules.update({ where: { id: rest.id }, data: { ...rest } }))
      }
      if (specialDays) {
        specialDay = await this.prisma.specialDays.update({ where: { id: specialDays.id }, data: { ...specialDays } })
      }
      if (specialSchedules) {
        promiseReq.push(this.prisma.specialSchedules.update({ where: { specialDayId: specialSchedules.specialDayId }, data: { ...specialSchedules } }))
      }
      if (restDays.length) {
        const finder = await this.prisma.restDays.findMany({ where: { professionalId: restDays[0].professionalId }, select: { id: true, professionalId: true, dayOfWeek: true } })

        restPromise = restDays.map((restDay) => {
          const findDay = finder.find((finderRest) => finderRest.dayOfWeek === restDay.dayOfWeek)
          if (findDay) {
            return this.prisma.restDays.delete({ where: { id: findDay.id } })
          } else {
            return this.prisma.restDays.create({ data: restDay })
          }
        })
      }

      if (!promiseReq.length && !specialDay && !restPromise) {
        throw new Error('No valid attributes were passed')
      }

      const updateReq = await Promise.all([...promiseReq, ...restPromise])

      if (specialDay) {
        updateReq.push(specialDay)
      }

      return updateReq
    }
}

export default new ScheduleModel()
