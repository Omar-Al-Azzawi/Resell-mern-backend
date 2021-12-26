import jwt from 'jsonwebtoken'

const token = (id: number) => {
  return jwt.sign({ id }, 'JWTsceret', {
    expiresIn: '1h',
  })
}

export default token
