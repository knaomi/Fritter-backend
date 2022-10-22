import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import type {Freet} from '../freet/model';

/**
 * This file defines the properties stored in an individual bookmark
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for BookMark on the backend
export type BookMark = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  originalFreet: Types.ObjectId;
  dateCreated: Date;

};

export type PopulatedBookMark = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  originalFreet: Freet;
  dateCreated: Date;
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
  }

});


const BookMarkModel = model<BookMark>('BookMark', BookMarkSchema);
export default BookMarkModel;
