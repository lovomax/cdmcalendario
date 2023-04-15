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

routes.post('/sign-professional', verifyToken, professionalController.store)
routes.put('/update-professional/:id', professionalController.update)
routes.get('/get-professionals', professionalController.list)
routes.get('/get-professional/:id', professionalController.getProfessional)
routes.get('/get-patients', professionalController.listPatients)

routes.post('/create-schedule', scheduleController.store)
routes.put('/update-schedule', scheduleController.update)

routes.post('/create-appointment', appointmentController.store)
routes.put('/update-appointment', appointmentController.update)
routes.delete('/delete-appointment', appointmentController.delete)

export default routes
