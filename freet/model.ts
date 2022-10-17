import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Freet
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Freet on the backend
export type Freet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: Types.ObjectId;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  // downfreetingUsers?: Array<Types.ObjectId>;
  // downfreetsNumber? : Number;

};

export type PopulatedFreet = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  authorId: User;
  dateCreated: Date;
  content: string;
  dateModified: Date;
  // downfreetingUsers?: Array<Types.ObjectId>;
  // downfreetsNumber? : Number;

};

// Mongoose schema definition for interfacing with a MongoDB table
// Freets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FreetSchema = new Schema<Freet>({
  // The author userId
  authorId: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The date the freet was created
  dateCreated: {
    type: Date,
    required: true
  },
  // The content of the freet
  content: {
    type: String,
    required: true
  },
  // The date the freet was modified
  dateModified: {
    type: Date,
    required: true
  }
});

// // (virtual-population)
// // Auto-populate a DownFreet.downfreeting_users field with any downFreets are associated with the originalFreet
// // such that a Freet.id = DownFreet.originalFreet._id
// FreetSchema.virtual('downfreetingUsers',{
//     ref: 'DownFreet',
//     localField: '_id',
//     foreignField: 'originalFreet'

// })


// FreetSchema.virtual('downfreetsNumber')
//     .get(function () {
//             return this.downfreetingUsers;
//     })
//     .set(function (usersDownfreeting: Array<Types.ObjectId>){
//         this.downfreetsNumber =usersDownfreeting.length
//     })

// // move the above two to Freet if it does not work


const FreetModel = model<Freet>('Freet', FreetSchema);
export default FreetModel;
