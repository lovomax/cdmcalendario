import jwt, { Secret } from 'jsonwebtoken'
import { Response, Request, NextFunction } from 'express'

const SECRET_KEY : Secret = process.env.SECRET_KEY as string

export function verifyToken (req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization

  if (!token) throw new Error('Missing token')

  try {
    const user = jwt.verify(token, SECRET_KEY)
    res.locals.user = user

    return next()
  } catch (err) {
    throw new Error('Invalid Token')
  }
}
