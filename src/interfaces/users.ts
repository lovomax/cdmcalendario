export interface User {
    name: string
    lastName: string
    birthDate: Date
    imageURL?: string
    email: string
    rut: string
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
    phoneNumber: string
    whatsAppNumber: string
    password: string
}

export interface UserUpdateInformations extends User {
    phoneNumbers: PhoneNumbers[]
    whatsAppNumbers: WhatsAppNumbers[]
    password: Auth
}

type role ='USER' | 'PROFESSIONAL'
