import jwt, { Secret } from 'jsonwebtoken'

const SECRET_KEY : Secret = process.env.SECRET_KEY as string

export const verifyToken = (token: string):void => {
  try {
    const verify = jwt.verify(token, SECRET_KEY)
    console.log(verify)
  } catch (err) {
    console.log(JSON.stringify(err))
  }
}
