import type {HydratedDocument, Types} from 'mongoose';
import type {Like} from './model';
import LikeModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore Likes
 * stored in MongoDB, including adding, finding, and deleting likes.
 *
 */
class LikeCollection {
  /**
   * Add a like to the collection
   *
   * @param {string} authorId - The id of the author of the like
   * @param {string} originalFreet - The id of the originalFreet
   * @return {Promise<HydratedDocument<Like>>} - The newly created like
   */
  static async addOne(authorId: Types.ObjectId | string, originalFreet: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    const date = new Date();
    const like = new LikeModel({
      authorId,
      originalFreet,
      dateCreated: date
    });
    await like.save(); // Saves like to MongoDB
    return like.populate('authorId');
  }

  /**
   * Find a like by likeId
   *
   * @param {string} likeId - The id of the like to find
   * @return {Promise<HydratedDocument<Like>> | Promise<null> } - The like with the given likeId, if any
   */
  static async findOne(likeId: Types.ObjectId | string): Promise<HydratedDocument<Like>> {
    return LikeModel.findOne({_id: likeId}).populate('authorId');
  }

  /**
   * Get all the likes in the database (i.e. on all Freets by all users)
   *
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
  static async findAll(): Promise<Array<HydratedDocument<Like>>> {
    // Retrieves likes and sorts them from most to least recent
    return LikeModel.find({}).sort({dateCreated: -1}).populate('authorId');
  }

  /**
   * Get all the likes in by given author
   *
   * @param {string} username - The username of author of the likes
   * @return {Promise<HydratedDocument<Like>[]>} - An array of all of the likes
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Like>>> {
    const author = await UserCollection.findOneByUsername(username);
    return LikeModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Get all the Likes on a Freet
   * 
   * @param {string} freetId - The Id of the Freet
   * @returns Promise<Array<HydratedDocument<Like>>> - An array of all the Likes
   */
  static async findAllbyFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Like>>>{
    const freet = await FreetCollection.findOne(freetId);
    return LikeModel.find({originalFreet: freet._id}).populate('_id');
  }

//   /**
//    * Update a freet with the new content - NOT RELEVANT SINCE A LIKE CAN ONLY BE ADDED OR DELETED
//    *
//    * @param {string} freetId - The id of the freet to be updated
//    * @param {string} content - The new content of the freet
//    * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
//    */
//   static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
//     const freet = await FreetModel.findOne({_id: freetId});
//     freet.originalFreet = content;
//     freet.dateModified = new Date();
//     await freet.save();
//     return freet.populate('authorId');
//   }

  /**
   * Delete a like with givenlikeId.
   *
   * @param {string} likeId - The likeId of like to delete
   * @return {Promise<Boolean>} - true if the like has been deleted, false otherwise
   */
  static async deleteOne(likeId: Types.ObjectId | string): Promise<boolean> {
    const like = await LikeModel.deleteOne({_id: likeId});
    return like !== null;
  }

  /**
   * Delete all the likes by the given author
   *
   * @param {string} authorId - The id of author of likes
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await LikeModel.deleteMany({authorId});
  }

  /**
   * Delete all the likes on a freet
   * @param {string} freetId - The id of the Freet whose likes are being deleted
   */
  static async deleteManybyFreetId(freetId: Types.ObjectId | string ):Promise<void>{
    await LikeModel.deleteMany({freetId})
  }
}



export default LikeCollection;