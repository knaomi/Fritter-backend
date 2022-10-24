import type {HydratedDocument, Types} from 'mongoose';
import type {ReFreet} from './model';
import ReFreetModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore refreets
 * stored in MongoDB, including adding, finding, and deleting refreets.
 *
 */
class ReFreetCollection {
  /**
   * Add a refreet to the collection
   *
   * @param {string} authorId - The id of the author of the refreet
   * @param {string} originalFreet - The id of the originalFreet
   * @return {Promise<HydratedDocument<ReFreet>>} - The newly created refreet
   */
  static async addOne(authorId: Types.ObjectId | string, originalFreet: Types.ObjectId | string): Promise<HydratedDocument<ReFreet>> {
    const date = new Date();
    const refreet = new ReFreetModel({
      authorId,
      originalFreet,
      dateCreated: date,
      expiringDate: (await FreetCollection.findOne(originalFreet))?.expiringDate,

    });
    await refreet.save(); // Saves downfreet to MongoDB
    return refreet.populate('authorId');
  }

  /**
   * Find a refreet by refreetId
   *
   * @param {string} refreetId - The id of the refreet to find
   * @return {Promise<HydratedDocument<ReFreet>> | Promise<null> } - The downfreet with the given refreetId, if any
   */
  static async findOne(refreetId: Types.ObjectId | string): Promise<HydratedDocument<ReFreet>> {
    return ReFreetModel.findOne({_id: refreetId, expiringDate: {$gt: new Date()}}).populate('authorId');
  }

  /**
   * Get all the refreets in the database (i.e. on all Freets by all users)
   *
   * @return {Promise<HydratedDocument<ReFreet>[]>} - An array of all of the refreets
   */
  static async findAll(): Promise<Array<HydratedDocument<  ReFreet>>> {
    // Retrieves refreets and sorts them from most to least recent
    return ReFreetModel.find({expiringDate: {$gt: new Date()}}).sort({dateCreated: -1}).populate('authorId');
  }

  /**
   * Get all the refreets in by given author
   *
   * @param {string} username - The username of author of the refreets
   * @return {Promise<HydratedDocument<ReFreet>[]>} - An array of all of the refreets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<ReFreet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return ReFreetModel.find({authorId: author._id, expiringDate: {$gt: new Date()}}).populate('authorId');
  }

  /**
   * Get all the ReFreets on a Freet
   * 
   * @param {string} freetId - The Id of the Freet
   * @returns Promise<Array<HydratedDocument<ReFreet>>> - An array of all the ReFreets
   */
  static async findAllbyFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<ReFreet>>>{
    const freet = await FreetCollection.findOne(freetId);
    return ReFreetModel.find({originalFreet: freet._id}).populate('_id');
  }


  /**
   * Delete a refreet with given refreetId.
   *
   * @param {string} refreetId - The refreetId of refreet to delete
   * @return {Promise<Boolean>} - true if the refreet has been deleted, false otherwise
   */
  static async deleteOne(refreetId: Types.ObjectId | string): Promise<boolean> {
    const refreet = await ReFreetModel.deleteOne({_id: refreetId});
    return refreet !== null;
  }

  /**
   * Delete all the refreets by the given author
   *
   * @param {string} authorId - The id of author of refreets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await ReFreetModel.deleteMany({authorId});
  }

  /**
   * Delete all the refreets on a freet
   * @param {string} freetId - The id of the Freet whose reFreets are being deleted
   */
  static async deleteManybyFreetId(freetId: Types.ObjectId | string ):Promise<void>{
    await ReFreetModel.deleteMany({freetId})
  }

 /**
   * Delete all the refreets on expired freets 
   *
   */
  static async deleteManybyExpiration(): Promise<void> {
    await ReFreetModel.deleteMany({expiringDate: {$lte: new Date()}});
  }
}



export default ReFreetCollection;
