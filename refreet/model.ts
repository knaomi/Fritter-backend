import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in a ReFreet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for ReFreet on the backend
export type ReFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  originalFreet: Types.ObjectId;
  dateCreated: Date;
  expiringDate: Date;

};

export type PopulatedReFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  originalFreet: Freet;
  dateCreated: Date;
  expiringDate: Date;

};

// Mongoose schema definition for interfacing with a MongoDB table
// ReFreets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReFreetSchema = new Schema<ReFreet>({
  // The author (of ReFreet) userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The content of the Refreet -> The actual Freet it was issued on
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
    required: false,
  },

});


const ReFreetModel = model<ReFreet>('ReFreet', ReFreetSchema);
export default ReFreetModel;
