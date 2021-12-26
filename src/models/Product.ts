/* eslint-disable @typescript-eslint/member-delimiter-style */
import mongoose, { Document, Schema } from 'mongoose'

import { UserDocument } from './User'

export type ProductDocument = Document & {
  name: string
  description: string
  price: number
  rating: number
  owner: UserDocument[]
  creator: string
  offer: string[]
  imgUrl: string
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 0,
  },
  owner: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  creator: {
    type: String,
  },
  offer: [
    {
      type: String,
    },
  ],
  imgUrl: {
    type: String,
  },
})

export default mongoose.model<ProductDocument>('Product', productSchema)
