import { PrismaClient } from '@prisma/client'
import { Appointments, GetSchedule, GetSpecialHour, ScheduleForm, ScheduleInformations, Schedules, SpecialSchedules } from '../interfaces/schedules'

class ScheduleModel {
    private prisma : PrismaClient

    public constructor () {
      this.prisma = new PrismaClient()
    }

    private listWorkingHour (data : {schedule: Schedules | SpecialSchedules, appointments: Appointments[]}) : object {
      const { schedule, appointments } = data
      const availableHours : Date[] = []
      const busyHours : Date[] = []
      if (schedule) {
        const professionalSession = 60
        for (let index = 0; index < 2; index++) {
          const initialHour = !index ? new Date(schedule.scheduleStart.toISOString()) : new Date(schedule.restEnd.toISOString())
          const finalHour = !index ? new Date(schedule.restStart.toISOString()) : new Date(schedule.scheduleEnd.toISOString())
          do {
            const currentHour = new Date(initialHour.toISOString())
            const availableMinutes = (finalHour.getUTCHours() * 60 + finalHour.getMinutes()) - (currentHour.getUTCHours() * 60 + currentHour.getMinutes())
            const busyHour = appointments.filter((item) => item.date.getUTCHours() === initialHour.getUTCHours()).map((item) => new Date(item.date))
            if (busyHour.length) {
              busyHours.push(...busyHour)
            }
            currentHour < finalHour && availableMinutes >= professionalSession && availableHours.push(new Date(initialHour.toISOString()))

            initialHour.setMinutes(initialHour.getMinutes() + professionalSession)
            // eslint-disable-next-line no-unmodified-loop-condition
          } while (initialHour < finalHour)
        }
      }

      return { availableHours, busyHours }
    }
    public async list (data : GetSchedule) : Promise<Schedules | object> {
      const monthDate = new Date(data.monthDate)
      const listReq = await this.prisma.professionals.findFirst({ where: { id: data.professionalId },
        select: {
          appointments: {
            where: {
              date: {
                lte: new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1),
                gte: new Date(monthDate.getFullYear(), monthDate.getMonth())
              }
            }
          },
          schedules: true,
          restDays: true,
          specialDays: {
            where: {
              date: {
                lte: new Date(monthDate),
                gte: new Date(monthDate.getFullYear(), monthDate.getMonth())
              }
            },
            select: { specialSchedules: true } }
        }
      })

      const availableHours : object | 0 | null = (listReq && listReq.schedules.length) && this.listWorkingHour({ schedule: listReq.schedules[0], appointments: listReq.appointments })

      return { ...listReq, ...availableHours }
    }

    public async listSpecialHour (data : GetSpecialHour) : Promise<object> {
      const { appointments, schedule } = data
      if (appointments) {
        if (appointments.length) {
          appointments.forEach((item, index) => { if (typeof item.date === 'string') data.appointments[index].date = new Date(item.date) })
          if (schedule) {
            Object.entries(schedule).forEach(([key]) => {
              if (typeof schedule[key] === 'string') {
                schedule[key] = new Date(schedule[key])
              }
            })
            const availableHours = (appointments.length && schedule) && this.listWorkingHour({ schedule, appointments })
            return { ...availableHours }
          }
        }
        throw new Error('Invalid schedule')
      }
      throw new Error('Invalid appointment')
    }

    public async listAllSchedules (data : GetSchedule) : Promise<object> {
      const listReq = await this.prisma.professionals.findFirst({ where: { id: data.professionalId },
        select: {
          appointments: true,
          schedules: true,
          restDays: true,
          specialDays: {
            include: { specialSchedules: true } }
        }
      })

      return { ...listReq }
    }

    public async createSchedule (data : ScheduleForm) : Promise <Schedules | object> {
      const filteredSchedule = data.schedules.filter((item) => item.dayOfWeek <= 7 && item.dayOfWeek > 0)
      const createReq = await this.prisma.schedules.createMany({ data: { ...filteredSchedule, professionalId: data.professionalId } })

      return createReq
    }

    public async updateSchedule (data : ScheduleForm) : Promise <Schedules | object> {
      const filteredSchedule = data.schedules.filter((item) => item.dayOfWeek <= 7 && item.dayOfWeek > 0)

      const updateReq = filteredSchedule.map((item) =>
        this.prisma.schedules.update({ where: { id: item.id }, data: { ...item } })
      )

      const promiseResolve = await Promise.all(updateReq)
      return promiseResolve
    }

    public async store (data : ScheduleInformations) : Promise<Schedules | object> {
      const { restDays, specialDays, specialSchedules, ...rest } = data
      const promiseReq : Promise<object>[] = []
      const SCHEDULE_LENGTH = 5
      var specialDay

      if (Object.keys(rest).length === SCHEDULE_LENGTH) {
        promiseReq.push(this.prisma.schedules.create({ data: { ...rest } }))
      }
      if (Object.keys(specialDays).length) {
        specialDay = await this.prisma.specialDays.create({ data: { ...specialDays } })
      }
      if (specialSchedules && Object.keys(specialDays).length) {
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
        if (Object.keys(specialDay).length && !specialSchedules.specialDayId && specialSchedules.scheduleStart) {
          promiseReq.push(this.prisma.specialSchedules.create({ data: { ...specialSchedules, specialDayId: specialDay.id } }))
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
