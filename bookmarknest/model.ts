import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
// import type {Freet} from '../freet/model';
import type { BookMark } from 'bookmark/model';

/**
 * This file defines the properties stored in a BookMarkNest
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for BookmarkNest on the backend
export type BookMarkNest = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  nestname: string;
  authorId: Types.ObjectId;
  defaultRootNest: boolean; // This indicates whether it is the root bookmark nest a.k.a folder.
  dateCreated: Date;
  bookmarks?: Array<Types.ObjectId>;

};

export type PopulatedBookMarkNest = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  nestname: string;
  authorId: User;
  defaultRootNest: boolean; // The root nest is created synchronously for each new User.
  dateCreated: Date;
  bookmarks: Array<BookMark>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// BookmarkNests stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const BookMarkNestSchema = new Schema<BookMarkNest>({
  nestname: {
    type: String,
    required: true
  },
  // The author (of BookMarkNest) userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },

  defaultRootNest: {
    type: Boolean,
    required: true,
    ref: 'Root'
  },

// //   // The content of each BookMarkNest -> The actual Freets that were bookmarked
//   bookmarks: {
//     // Use Types.ObjectId outside of the schema
//     type: Array<Schema.Types.ObjectId>,
//     required: true,
//     ref: 'Bookmarks'
//   },

  dateCreated:{
    type:Date,
    required: true
  }

},{
  toObject: { virtuals: true, versionKey: false },
  toJSON: { virtuals: true, versionKey: false }
});

// (virtual-population)
// Auto-populate a BookMarkNest.bookmarks field with any bookmarks are associated with this BookMarkNest such that BookMarkNest._id === Bookmark.nestId._id
BookMarkNestSchema.virtual('bookmarks', {
  ref: 'BookMark',
  localField: '_id',
  foreignField: 'nestId'
});

const BookMarkNestModel = model<BookMarkNest>('BookMarkNest', BookMarkNestSchema);
export default BookMarkNestModel;
