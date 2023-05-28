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
    chosenField: number
    chosenForecast: number
    chosenIntervention: number
    chosenModality: number
    chosenSpecialty: number
    chosenPaymentMethod: number
}

export interface AppointmentProfessional {
    professionalId: string
    rut: string
    date: Date
    observation: string
    chosenField: number
    chosenForecast: number
    chosenIntervention: number
    chosenModality: number
    chosenSpecialty: number
    chosenPaymentMethod: number
}

export interface AppointmentResponse {
    status: string
    message: string
    data: object
}
