import jwt, { Secret } from 'jsonwebtoken'
import { Response, Request, NextFunction } from 'express'
import { messages, status } from '../utils/httpResponses'
import { httpStatus } from '../utils/httpStatus'

const { VALIDATION_ERROR } = messages
const { FORBIDDEN } = status

const SECRET_KEY : Secret = process.env.SECRET_KEY as string

interface MiddleResponse {
  status: string
  message: string
  data: object
}

function objResponse (status : string, message : string, data : object) : MiddleResponse {
  return { status, message, data }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function verifyToken (req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization

  if (!token) throw new Error('Missing token')

  try {
    const user = jwt.verify(token, SECRET_KEY)
    res.locals.user = user

    return next()
  } catch (err) {
    const returnObj = objResponse(FORBIDDEN, VALIDATION_ERROR, err.message)

    return res.status(httpStatus.FORBIDDEN).json(returnObj)
  }
}
