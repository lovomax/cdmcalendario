export interface User {
    name: string
    lastName: string
    birthDate?: Date
    imageURL?: string
    email?: string
    rut?: string
}

export interface UserResponse {
    status: string
    message: string
    data: object
}

export interface Appointments {
    professionalId: string
    userId: string
    date: Date
}

export interface Addresses {
    id: number
    userId: string
    region: number
    province: number
    comune: number
    street: string
    roleOfAddress: role
}

export interface PhoneNumbers {
    id: number
    userId: string
    number: string
    roleOfNumber: role
}

export interface WhatsAppNumbers {
    id: number
    userId: string
    number: string
    roleOfNumber: role

}

export interface Auth {
    userId: string
    password: string
}

export interface UserInformations extends User {
    phoneNumbers: string
    whatsAppNumbers: string
    password?: string
}

export interface GetUser {
    id: string
}

export interface UserUpdateInformations extends User {
    id: string
    userForecastId?: number
    phoneNumbers: PhoneNumbers[]
    whatsAppNumbers: WhatsAppNumbers[]
    password: Auth
}

type role ='USER' | 'PROFESSIONAL'
