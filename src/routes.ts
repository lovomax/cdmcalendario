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
routes.put('/update-user/:id', verifyToken, userController.update)
routes.get('/list', verifyToken, userController.list)

routes.get('/get-comissions', verifyToken, userController.comissionGet)
routes.post('/create-comission/:id', verifyToken, userController.comissionCreate)
routes.put('/update-comission/:id/:cid', verifyToken, userController.comissionUpdate)
routes.delete('/delete-comission/:id/:cid', verifyToken, userController.comissionDelete)

routes.post('/sign-professional/:id', verifyToken, professionalController.store)
routes.put('/update-professional/:id', verifyToken, professionalController.update)
routes.get('/get-professionals', professionalController.listPagination)
routes.get('/get-professional/:id', professionalController.getProfessional)
routes.get('/get-credits/:id', verifyToken, professionalController.getCredits)

routes.post('/create-schedules/:id', verifyToken, scheduleController.createSchedule) // NEW
routes.put('/update-schedules/:id', verifyToken, scheduleController.updateSchedule) // NEW
routes.put('/delete-schedules/:id', verifyToken, scheduleController.deleteSchedule) // NEW

routes.get('/get-all-schedules/:id', verifyToken, scheduleController.listAllSchedules)
routes.get('/get-schedules/:id/:date', scheduleController.list)
routes.post('/get-special-hours/', scheduleController.listSpecialHour)
routes.post('/create-schedule/:id', verifyToken, scheduleController.store)
routes.put('/update-schedule/:id', verifyToken, scheduleController.update)

routes.get('/list-appointment/:id', verifyToken, appointmentController.list)
routes.get('/get-session-number/:pid/:uid', verifyToken, appointmentController.getSessionNumber)
routes.get('/find-patients/:id', verifyToken, appointmentController.findPatients)
routes.get('/find-all-patients/:id', verifyToken, appointmentController.findAllPatients)
routes.get('/list-invoices/:id', verifyToken, appointmentController.listInvoices)
routes.get('/get-patients/:id', verifyToken, appointmentController.listPatients)
routes.get('/get-all-registers/:id/:start/:end', verifyToken, appointmentController.listAllRegisters)
routes.get('/get-registers/:id/:start/:end', verifyToken, appointmentController.listRegisters)
routes.post('/create-appointment/:id', appointmentController.store)
routes.post('/create-professional-appointment', verifyToken, appointmentController.appointmentProfessional)
routes.put('/update-appointment', verifyToken, appointmentController.update)
routes.delete('/delete-appointment', verifyToken, appointmentController.delete)

export default routes
