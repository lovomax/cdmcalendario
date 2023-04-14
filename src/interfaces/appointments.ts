export interface Appointment {
    id: number
    professionalId: string
    userId: string
    date: Date
}

export interface AppointmentResponse {
    status: string
    message: string
    data: object
}
