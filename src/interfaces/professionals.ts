export interface Study {
    professionalId: string
    title: string
}

export interface ProfessionalFields{
    professionalId: string
    fieldId: number
}

export interface ProfessionalForecasts{
    professionalId: string
    forecastId: number
}

export interface ProfessionalInterventions{
    professionalId: string
    interventionId: number
}

export interface ProfessionalModalities{
    professionalId: string
    modalityId: number
}

export interface ProfessionalPaymentMethods{
    professionalId: string
    paymentMethodId: number
}

export interface ProfessionalSpecialties{
    professionalId: string
    specialtyId: number
}

export interface RestDay{
    professionalId: string
    dayOfWeek: number
}

export interface Schedule{
    professionalId: string
    scheduleStart: Date
    scheduleEnd: Date
    restStart: Date
    restEnd: Date
}

export interface SpecialDay{
    professionalId: string
    date: Date
}

export interface SpecialSchedule {
    specialDayId: number
    scheduleStart: Date
    scheduleEnd: Date
    restStart: Date
    restEnd: Date
}

export interface Field{
    name: string
}

export interface Forecast{
    name: string
}

export interface Intervention{
    name: string
}

export interface Modality{
    name: string
}

export interface PaymentMethod{
    name: string
}

export interface Specialty{
    name: string
}

export interface Professional {
    userId: string
}

export interface ProfessionalResponse {
    status: string
    message: string
    data: object
}

export interface ProfessionalInformations extends Professional {
    study: Study
    professionalFields: ProfessionalFields
    professionalForecasts: ProfessionalForecasts
    professionalInterventions: ProfessionalInterventions
    professionalModalities: ProfessionalModalities
    professionalPaymentMethods: ProfessionalPaymentMethods
    professionalSpecialties: ProfessionalSpecialties
}
