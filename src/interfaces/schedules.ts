export interface Schedules {
    id: number
    professionalId: string
    scheduleStart: Date
    scheduleEnd: Date
    restStart: Date
    restEnd: Date
    dayOfWeek: number
}

export interface RestDays {
    id: number
    professionalId: string
    dayOfWeek: number
}

export interface SpecialDays {
    id: number
    professionalId: string
    date: Date
}

export interface SpecialSchedules {
    id: number
    specialDayId: number
    scheduleStart: Date
    scheduleEnd: Date
    restStart: Date
    restEnd: Date
}

export interface ScheduleInformations extends Schedules {
    restDays: RestDays[]
    specialDays: SpecialDays
    specialSchedules: SpecialSchedules
}

export interface ScheduleForm {
    schedules: Schedules[]
    professionalId: string
}

export interface Appointments {
    professionalId: string
    date: Date
}

export interface ScheduleResponse {
    status: string
    message: string
    data: object
}

export interface GetSchedule {
    professionalId: string
    monthDate: Date
}

export interface GetSpecialHour {
    appointments: Appointments[]
    schedule: SpecialSchedules
}
