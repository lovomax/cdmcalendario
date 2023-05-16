import { Router } from 'express'
import userController from './controllers/userController'
import professionalController from './controllers/professionalController'
import { verifyToken } from './middlewares/auth'
import scheduleController from './controllers/scheduleController'
import appointmentController from './controllers/appointmentController'

const routes = Router()

routes.get('/checkhealth', (_req, res) => {
  res.json({ message: 'online' })
})

routes.post('/sign-up', userController.store)
routes.post('/log-in', userController.logIn)
routes.put('/update-user/:id', userController.update)
routes.get('/list', verifyToken, userController.list)
routes.get('/get-user/:id', userController.getUser)

routes.post('/sign-professional/:id', verifyToken, professionalController.store)
routes.put('/update-professional/:id', professionalController.update)
/* routes.get('/get-professionals', professionalController.list) */
routes.get('/get-professionals', professionalController.listPagination)
routes.get('/get-professional/:id', professionalController.getProfessional)

routes.post('/create-schedules/:id', scheduleController.createSchedule) // NEW
routes.put('/update-schedules/:id', scheduleController.updateSchedule) // NEW
routes.put('/delete-schedules/:id', scheduleController.deleteSchedule) // NEW

routes.get('/get-all-schedules/:id', scheduleController.listAllSchedules)
routes.post('/get-schedules/:id', scheduleController.list)
routes.post('/get-special-hours/', scheduleController.listSpecialHour)
routes.post('/create-schedule/:id', scheduleController.store)
routes.put('/update-schedule/:id', scheduleController.update)

routes.get('/list-appointment/:id', appointmentController.list)
routes.get('/get-patients/:id', appointmentController.listPatients)
routes.get('/get-registers/:id/:start/:end', appointmentController.listRegisters)
routes.post('/create-appointment/:id', appointmentController.store)
routes.put('/update-appointment', appointmentController.update)
routes.delete('/delete-appointment', appointmentController.delete)

export default routes
