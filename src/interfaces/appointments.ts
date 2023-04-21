export interface Appointment {
    id: number
    professionalId: string
    userId: string
    date: Date
}

export interface AppointmentUserInformation extends Appointment {
    name: string
    lastName: string
    birthDate?: Date
    email?: string
    rut?: string
    phoneNumbers: string
    whatsAppNumbers: string
}

export interface AppointmentResponse {
    status: string
    message: string
    data: object
}
