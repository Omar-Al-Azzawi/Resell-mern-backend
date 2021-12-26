import express from 'express'
import lusca from 'lusca'
import dotenv from 'dotenv'
import cors from 'cors'

import { googleStrategy } from './config/passport'
import userRouter from './routers/user'
import productRouter from './routers/product'
import apiErrorHandler from './middlewares/apiErrorHandler'
import apiContentType from './middlewares/apiContentType'
import compression from 'compression'
import passport from 'passport'

dotenv.config({ path: '.env' })
const app = express()

// Express configuration
app.set('port', process.env.PORT || 3000)
app.use(apiContentType)
// Use common 3rd-party middlewares
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.use(passport.initialize())
app.use(passport.session())

// Use product router
app.use('/api/v1/products', productRouter)

// Use User router
passport.use(googleStrategy)
app.use('/api/v1/users', userRouter)

// Custom API error handler
app.use(apiErrorHandler)

export default app
