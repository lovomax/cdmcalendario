import { PrismaClient } from '@prisma/client'
import data from './data.json'

const prisma = new PrismaClient()

type state = 'BOOKED' | 'CONFIRMED' | 'CANCELED' | 'RESCHEDULED' | 'PENDING';
type role = 'USER' | 'PROFESSIONAL' | 'ADMIN';

interface Appointment {
  id: number;
  oldProfessionalUserId: number;
  oldUserId: number;
  date: Date;
  chosenService: number;
  sessionNumber: number;
  state: state;
  observation: string;
  chosenForecast: number;
  chosenModality: number;
  price: number;
}

interface NewAppointment {
  id: number;
  userId: string;
  date: Date;
  chosenService: number;
  state: state;
  observation: string;
  chosenForecast: number;
  sessionNumber: number;
}

interface FinalAppointment {
  professionalId: string;
  userId: string;
  date: Date;
  chosenService: number | null;
  state: state;
  observation: string;
  chosenForecast: number | null;
  chosenModality: number | null;
  sessionNumber: number;
  price: number;
}

interface Professional {
  oldUserId: number;
}
interface NewUsers {
  oldId: number;
  name: string;
  lastName: string;
  fullName: string;
  email: string;
  phoneNumbers: string;
  roleOfUser: role;
}
interface Users {
  oldId: number;
  name: string;
  lastName: string;
  fullName: string;
  email: string;
  roleOfUser: role;
}
interface Forecasts {
  name: string;
}
interface PhoneNumbers {
  oldUserId: number;
  number: string;
}
interface StoredIds {
  id: number;
  trueId: string;
}
interface TrueIds {
  userIds: StoredIds[]
  professionalIds: StoredIds[]
}
const importObj = {
  users: [],
  professionals: [],
  appointments: [],
  services: [],
  forecasts: [],
  modalities: []
}

const users: Users[] = []
const professionals: Professional[] = []
const appointments: Appointment[] = []
const forecasts: Forecasts[] = []
const phoneNumbers: PhoneNumbers[] = []

const initializeObj = () : void => {
  Object.entries(data).forEach(([tableName, tableData]) => {
    if (tableName) {
      switch (tableName) {
        case 'appointments':
          appointments.push(...tableData)
          break
        case 'services':
          importObj[tableName] = tableData
          break
        case 'modalities':
          importObj.modalities = tableData
          break
        case 'professionals':
          professionals.push(...tableData)
          break
        case 'users':
          users.push(
            tableData.map((user: NewUsers) => {
              return {
                oldId: Number(user.oldId),
                name: user.name,
                lastName: user.lastName,
                fullName: user.fullName,
                email: user.email,
                roleOfUser: user.roleOfUser
              }
            })
          )
          phoneNumbers.push(
            tableData.map((user: NewUsers) => {
              return {
                oldId: Number(user.oldId),
                number: user.phoneNumbers
              }
            })
          )
          break
        case 'forecasts':
          tableData.forEach((forecast: Forecasts) => {
            forecasts.push({ name: forecast.name })
          })
          break
        default:
          break
      }
    }
  })
}

const createBasics = async () : Promise<void> => {
  await prisma.services.createMany({ data: importObj.services })

  await prisma.forecasts.createMany({ data: forecasts.flat() })

  await prisma.modalities.createMany({ data: importObj.modalities })
}

const createUsers = async () : Promise<void> => {
  await prisma.users.createMany({ data: users.flat() })
}

const createProfessionals = async () : Promise<void> => {
  const totalProfessionals: object[] = []
  professionals.forEach((professional) => {
    console.log(professional)
    if (professional.oldUserId) {
      const individualProfessional = prisma.professionals.create({
        data: {
          users: { connect: { oldId: Number(professional.oldUserId) } },
          oldUserId: Number(professional.oldUserId)
        }
      })
      totalProfessionals.push(individualProfessional)
    }
  })
  await Promise.all(totalProfessionals)
}

const findTrueIds = async () : Promise<TrueIds> => {
  const storedIds: StoredIds[] = []
  const proStoredIds: StoredIds[] = []
  const userOldIds: { id: number }[] = []
  const professionalOldIds: { id: number }[] = []
  const users: object[] = []
  const professionals: object[] = []
  appointments.forEach(async (item) => {
    if (!userOldIds.find((obj) => Number(obj.id) === Number(item.oldUserId))) {
      userOldIds.push({ id: Number(item.oldUserId) })
      const User = prisma.users
        .findUniqueOrThrow({
          where: { oldId: Number(item.oldUserId) },
          select: { id: true }
        })
        .then((user) => {
          storedIds.push({ id: Number(item.oldUserId), trueId: user.id })
        })
      users.push(User)
    }
    if (
      !professionalOldIds.find(
        (obj) => Number(obj.id) === Number(item.oldProfessionalUserId)
      )
    ) {
      professionalOldIds.push({ id: Number(item.oldProfessionalUserId) })
      const professional = prisma.professionals
        .findUnique({
          where: { oldUserId: Number(item.oldProfessionalUserId) },
          select: { id: true }
        })
        .then((p) => {
          if (p) {
            proStoredIds.push({
              id: Number(item.oldProfessionalUserId),
              trueId: p.id
            })
          }
        })
      professionals.push(professional)
    }
  })
  await Promise.all(users)
  await Promise.all(professionals)
  return { userIds: storedIds, professionalIds: proStoredIds }
  // await prisma.appointments.createMany({data: totalAppointments})
}

const createAppointments = async (trueIds : {userIds: StoredIds[], professionalIds: StoredIds[]}) : Promise<void> => {
  const newAppointmentList : FinalAppointment[] = []
  appointments.forEach((appointment) => {
    const user = trueIds.userIds.find((user) => user.id === Number(appointment.oldUserId))
    if (!user) { return }
    const userId = user.trueId
    const professional = trueIds.professionalIds.find((professional) => professional.id === Number(appointment.oldProfessionalUserId))
    if (!professional) { return }
    const professionalId = professional.trueId
    const date = new Date(appointment.date)
    const sessionNumber = appointment.sessionNumber
    const chosenForecast = appointment.chosenForecast ? Number(appointment.chosenForecast) : null
    const chosenService = appointment.chosenService ? Number(appointment.chosenService) : null
    const chosenModality = appointment.chosenModality ? Number(appointment.chosenModality) : null
    if (userId && professionalId) {
      newAppointmentList.push({
        userId: userId,
        professionalId: professionalId,
        date: date,
        chosenForecast: chosenForecast,
        chosenService: chosenService,
        chosenModality: chosenModality,
        observation: appointment.observation,
        sessionNumber: sessionNumber,
        state: appointment.state,
        price: appointment.price
      })
    }
  })

  await prisma.appointments.createMany({ data: newAppointmentList })
}

const load = async () : Promise<void> => {
  try {
    initializeObj()
    await createBasics()
    console.log('Added basics')
    await createUsers()
    console.log('Added user data')

    await createProfessionals()
    console.log('Added professional data')

    await findTrueIds().then(async (res) => {
      await createAppointments(res)
    })

    console.log('Added appointment data')
  } catch (err) {
    console.error(err)
  } finally {
    await prisma.$disconnect()
  }
}

load()
