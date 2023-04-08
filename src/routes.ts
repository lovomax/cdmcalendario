import { Router } from 'express'
import userController from './controllers/userController'
import professionalController from './controllers/professionalController'

const routes = Router()

routes.get('/checkhealth', (_req, res) => {
  res.json({ message: 'online' })
})

routes.post('/sign-up', userController.store)
routes.post('/log-in', userController.logIn)
routes.get('/list', userController.list)

routes.post('/sign-professional', professionalController.store)

export default routes
