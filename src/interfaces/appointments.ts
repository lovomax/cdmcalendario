export interface Appointment {
    id: number
    professionalId: string
    userId: string
    date: Date
}

export interface AppointmentUpdate extends Appointment {
    observation: string
    chosenField: number
    chosenForecast: number
    chosenIntervention: number
    chosenModality: number
    chosenSpecialty: number
    chosenPaymentMethod: number
    state: state
}

type state = 'BOOKED' | 'CONFIRMED' | 'CANCELED' | 'RESCHEDULED' | 'PENDING'

export interface AppointmentUserInformation extends Appointment {
    name: string
    lastName: string
    birthDate?: Date
    email?: string
    rut?: string
    phoneNumbers: string
    whatsAppNumbers: string
    chosenField: number
    chosenForecast: number
    chosenIntervention: number
    chosenModality: number
    chosenSpecialty: number
    chosenPaymentMethod: number
}

export interface AppointmentProfessional {
    professionalId: string
    userId: string
    date: Date
    state: state
    observation: string
    chosenField: number
    chosenForecast: number
    chosenIntervention: number
    chosenModality: number
    chosenSpecialty: number
    chosenPaymentMethod: number
    chosenService: number
}

export interface AppointmentResponse {
    status: string
    message: string
    data: object
}
