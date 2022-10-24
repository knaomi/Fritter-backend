import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a DownFreet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for DownFreet on the backend
export type DownFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  originalFreet: Types.ObjectId;
  dateCreated: Date;
  expiringDate: Date;
};

export type PopulatedDownFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  originalFreet: Freet;
  dateCreated: Date;
  expiringDate: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const DownFreetSchema = new Schema<DownFreet>({
  // The author (of DownFreet) userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The content of the Downfreet -> The actual Freet it was issued on
  originalFreet: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },

  dateCreated:{
    type:Date,
    required: true
  },
  expiringDate:{
    type:Date,
    required: false // dependent on freet having an expiration date
  }


});


const DownFreetModel = model<DownFreet>('DownFreet', DownFreetSchema);
export default DownFreetModel;
