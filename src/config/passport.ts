import passport from 'passport'
import passportLocal from 'passport-local'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const GoogleTokenStrategy = require('passport-google-id-token')

import userServes from '../services/user'

import { Request, Response, NextFunction } from 'express'

const LocalStrategy = passportLocal.Strategy

export const googleStrategy = new GoogleTokenStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
  },
  async function (parsedToken: any, googleId: string, done: any) {
    console.log(parsedToken)

    const userPayload = {
      email: parsedToken.payload.email,
      firstName: parsedToken.payload.given_name,
      lastName: parsedToken.payload.family_name,
    }

    try {
      const user = await userServes.findOrCreate(userPayload)
      done(null, user)
    } catch (err) {
      done(err)
    }
  }
)
