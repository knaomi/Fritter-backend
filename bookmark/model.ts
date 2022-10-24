import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';
import { BookMarkNest } from '../bookmarknest/model';

/**
 * This file defines the properties stored in an individual bookmark
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for BookMark on the backend
export type BookMark = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  nestId: Types.ObjectId; // each bookmark must belong to a specific nest
  originalFreet: Types.ObjectId;
  dateCreated: Date;
  expiringDate: Date;

};

export type PopulatedBookMark = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  nestId: BookMarkNest;
  originalFreet: Freet;
  dateCreated: Date;
  expiringDate: Date;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Bookmarks stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const BookMarkSchema = new Schema<BookMark>({
  // The author (of BookMark) userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  nestId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'BookMarkNest'
  },

  // The content of the BookMark -> The actual Freet it was issued on
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
    required: false
  }

});


const BookMarkModel = model<BookMark>('BookMark', BookMarkSchema);
export default BookMarkModel;
