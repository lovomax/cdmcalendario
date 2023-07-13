export interface Study {
    id: number
    professionalId: string
    title: string
    university: string
    yearOfEgress: number
    toDelete: boolean
}

export interface InitialStudies {
    id?: number
    university: string
    title: string
    yearOfEgress: number
}

export interface ProfessionalFields{
    id: number
    professionalId: string
    specializedId: number
    toDelete: boolean
}

export interface ProfessionalForecasts{
    id: number
    professionalId: string
    specializedId: number
    toDelete: boolean
}

export interface ProfessionalInterventions{
    id: number
    professionalId: string
    specializedId: number
    toDelete: boolean
}

export interface ProfessionalModalities{
    id: number
    professionalId: string
    specializedId: number
    toDelete: boolean
}

export interface ProfessionalPaymentMethods{
    id: number
    professionalId: string
    specializedId: number
    toDelete: boolean
}

export interface ProfessionalSpecialties{
    id: number
    professionalId: string
    specializedId: number
    toDelete: boolean
}

export interface ProfessionalServices{
    id: number
    professionalId: string
    toDelete: boolean
    specializedId: number
}

export interface ServicePrices {
    id: number
    serviceId: number
    serviceSpecializedId: number
    forecastId: number
    forecastSpecializedId: number
    price: number
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
    studies: Study[],
    dateRangeStart: number,
    dateRangeEnd: number,
    professionalFields: ProfessionalFields[]
    professionalForecasts: ProfessionalForecasts[]
    professionalInterventions: ProfessionalInterventions[]
    professionalModalities: ProfessionalModalities[]
    professionalPaymentMethods: ProfessionalPaymentMethods[]
    professionalSpecialties: ProfessionalSpecialties[]
    professionalServices: ProfessionalServices[]
    servicePrices: ServicePrices[]
}

export interface GetPaginationProfessional {
    cursor?: string,
    userAge?: number,
    take?: number,
    skip?: number,
    field?: number,
    specialty?: number,
    forecast?: number,
    modality?: number,
    service?: number,
    intervention?: number
}

export interface GetProfessional {
    id: string
}
