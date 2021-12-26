import User, { UserDocument } from '../models/User'
import { NotFoundError } from '../helpers/apiError'
import { JWT_SECRET } from '../util/secrets'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const create = async (user: UserDocument): Promise<UserDocument> => {
  return user.save()
}

const findOrCreate = async (payload: Partial<UserDocument>) => {
  return User.findOne({ email: payload.email })
    .exec()
    .then((user) => {
      if (!user) {
        const newUser = new User({
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
        })
        newUser.save()
        return newUser
      }
      return user
    })
}

const findById = async (userId: string): Promise<UserDocument> => {
  const foundUser = await User.findById(userId)

  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }

  return foundUser
}

const findAll = async (): Promise<UserDocument[]> => {
  return User.find().populate('products', { name: 1 }).sort({ name: 1 })
}

const update = async (
  userId: string,
  update: Partial<UserDocument>
): Promise<UserDocument | null> => {
  const foundUser = await User.findByIdAndUpdate(userId, update, {
    new: true,
  })

  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }

  return foundUser
}

const deleteUser = async (userId: string): Promise<UserDocument | null> => {
  const foundUser = User.findByIdAndDelete(userId)

  if (!foundUser) {
    throw new NotFoundError(`User ${userId} not found`)
  }

  return foundUser
}

const login = async (
  email: string,
  password: string
): Promise<UserDocument | null> => {
  const foundUser = await User.findOne({ email })

  if (!foundUser) {
    throw new NotFoundError(`User ${email} not found`)
  }

  const isValidPassword = foundUser.password
  bcrypt.compare(password, isValidPassword).then((isMatch) => {
    if (!isMatch) {
      throw new NotFoundError(`User ${email} not found`)
    }
    return foundUser
  })
  if (!isValidPassword) {
    throw new NotFoundError('Invalid password')
  }
  jwt.sign({ userId: foundUser._id }, JWT_SECRET, { expiresIn: '1h' })
  return foundUser
}

export default {
  create,
  findById,
  findAll,
  update,
  deleteUser,
  login,
  findOrCreate,
}
