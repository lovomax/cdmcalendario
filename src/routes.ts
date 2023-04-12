import { Router } from 'express'
import userController from './controllers/userController'
import professionalController from './controllers/professionalController'
import { verifyToken } from './middlewares/auth'
import scheduleController from './controllers/scheduleController'

const routes = Router()

routes.get('/checkhealth', (_req, res) => {
  res.json({ message: 'online' })
})

routes.post('/sign-up', userController.store)
routes.post('/log-in', userController.logIn)
routes.put('/update-user', userController.update)
routes.get('/list', verifyToken, userController.list)

routes.post('/sign-professional', verifyToken, professionalController.store)
routes.put('/update-professional', professionalController.update)
routes.get('/get-professionals', professionalController.list)

routes.post('/create-schedule', scheduleController.store)

export default routes
