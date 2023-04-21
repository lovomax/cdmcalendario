import { PrismaClient } from '@prisma/client'
import { GetSchedule, ScheduleInformations, Schedules } from '../interfaces/schedules'

class ScheduleModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }
    public async list (data : GetSchedule) : Promise<Schedules | object> {
      const listReq = await this.prisma.professionals.findFirst({ where: { id: data.professionalId }, select: { schedules: true, restDays: true, appointments: { select: { date: true, professionalId: true } }, specialDays: { include: { specialSchedules: true } } } })
      const availableHours : Date[] = []
      const busyHours : Date[] = []

      if (listReq) {
        if (listReq.schedules.length) {
          const professionalSession = 60
          for (let index = 0; index < 2; index++) {
            const initialHour = !index ? new Date(listReq.schedules[0].scheduleStart.toISOString()) : new Date(listReq.schedules[0].restEnd.toISOString())
            const finalHour = !index ? new Date(listReq.schedules[0].restStart.toISOString()) : new Date(listReq.schedules[0].scheduleEnd.toISOString())
            do {
              const currentHour = new Date(initialHour.toISOString())
              const availableMinutes = (finalHour.getUTCHours() * 60 + finalHour.getMinutes()) - (currentHour.getUTCHours() * 60 + currentHour.getMinutes())
              const busyHour = listReq.appointments.find((item) => item.date.getUTCHours() === initialHour.getUTCHours())
              if (busyHour) {
                busyHours.push(new Date(busyHour.date))
              }
              currentHour < finalHour && availableMinutes >= professionalSession && availableHours.push(new Date(initialHour.toISOString()))

              initialHour.setMinutes(initialHour.getMinutes() + professionalSession)
            // eslint-disable-next-line no-unmodified-loop-condition
            } while (initialHour < finalHour)
          }
        }
      }
      return { ...listReq, availableHours: availableHours, busyHours: busyHours }
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
      var restPromise : object[] = []

      if (Object.keys(rest).length === SCHEDULE_LENGTH) {
        promiseReq.push(this.prisma.schedules.upsert({ where: { id: rest.id }, update: { ...rest }, create: { ...rest } }))
      }
      if (specialDays.date) {
        if (specialDays.id) {
          specialDay = await this.prisma.specialDays.update({ where: { id: specialDays.id }, data: { ...specialDays } })
        } else {
          specialDay = await this.prisma.specialDays.create({ data: { ...specialDays, professionalId: rest.professionalId } })
        }
      }
      if (specialSchedules) {
        const toUpdateSpecial = await this.prisma.specialSchedules.findFirst({ where: { specialDayId: specialSchedules.specialDayId } })
        if (specialDay && !specialSchedules.specialDayId && specialSchedules.scheduleStart) {
          promiseReq.push(this.prisma.specialSchedules.create({ data: { ...specialSchedules } }))
        } else if (toUpdateSpecial) {
          promiseReq.push(this.prisma.specialSchedules.update({ where: { specialDayId: specialSchedules.specialDayId }, data: { ...specialSchedules } }))
        } else {
          promiseReq.push(this.prisma.specialSchedules.create({ data: { ...specialSchedules } }))
        }
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

      const updateReq = await Promise.all(promiseReq)
      if (restPromise.length) {
        await Promise.all(restPromise)
      }

      if (specialDay) {
        updateReq.push(specialDay)
      }

      return updateReq
    }
}

export default new ScheduleModel()
