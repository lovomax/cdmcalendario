import { Router } from 'express'
import userController from './controllers/userController'

const routes = Router()

routes.get('/checkhealth', (_req, res) => {
  res.json({ message: 'online' })
})

routes.post('/sign-up', userController.store)

export default routes
