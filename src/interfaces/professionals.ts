export interface Study {
    id: number
    professionalId: string
    title: string
}

export interface ProfessionalFields{
    id: number
    professionalId: string
    specializedId: number
}

export interface ProfessionalForecasts{
    id: number
    professionalId: string
    specializedId: number
}

export interface ProfessionalInterventions{
    id: number
    professionalId: string
    specializedId: number
}

export interface ProfessionalModalities{
    id: number
    professionalId: string
    specializedId: number
}

export interface ProfessionalPaymentMethods{
    id: number
    professionalId: string
    specializedId: number
}

export interface ProfessionalSpecialties{
    id: number
    professionalId: string
    specializedId: number
}

export interface ProfessionalServices{
    id: number
    professionalId: string
    specializedId: number
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

export interface Service{
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
    studies: Study[]
    professionalFields: ProfessionalFields[]
    professionalForecasts: ProfessionalForecasts[]
    professionalInterventions: ProfessionalInterventions[]
    professionalModalities: ProfessionalModalities[]
    professionalPaymentMethods: ProfessionalPaymentMethods[]
    professionalSpecialties: ProfessionalSpecialties[]
    professionalServices: ProfessionalServices[]
}

export interface GetProfessional {
    id: string
}
