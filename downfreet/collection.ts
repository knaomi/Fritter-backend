import type {HydratedDocument, Types} from 'mongoose';
import type {DownFreet} from './model';
import DownFreetModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore downfreets
 * stored in MongoDB, including adding, finding, and deleting downfreets.
 *
 */
class DownFreetCollection {
  /**
   * Add a downfreet to the collection
   *
   * @param {string} authorId - The id of the author of the downfreet
   * @param {string} originalFreet - The id of the originalFreet
   * @return {Promise<HydratedDocument<DownFreet>>} - The newly created downfreet
   */
  static async addOne(authorId: Types.ObjectId | string, originalFreet: Types.ObjectId | string): Promise<HydratedDocument<DownFreet>> {
    const date = new Date();
    const downfreet = new DownFreetModel({
      authorId,
      originalFreet,
      dateCreated: date
    });
    await downfreet.save(); // Saves downfreet to MongoDB
    return downfreet.populate('authorId');
  }

  /**
   * Find a downfreet by downfreetId
   *
   * @param {string} downfreetId - The id of the downfreet to find
   * @return {Promise<HydratedDocument<DownFreet>> | Promise<null> } - The downfreet with the given downfreetId, if any
   */
  static async findOne(downfreetId: Types.ObjectId | string): Promise<HydratedDocument<DownFreet>> {
    return DownFreetModel.findOne({_id: downfreetId}).populate('authorId');
  }


/**
   * Find a downfreet by freetId for a given author
   * @param {string} freetId - The id of the originalfreet
   * @param {string} authorId - The id of the author of the like on freet to find
   * @return {Promise<HydratedDocument<Down>> | Promise<null> } - The downfreet on the freet by author, if any
  */
 static async findOneByFreetId(freetId: string, authorId: Types.ObjectId | string): Promise<HydratedDocument<DownFreet>> {
  const author = await UserCollection.findOneByUserId(authorId);
  const freet = await FreetCollection.findOne(freetId);
  return DownFreetModel.findOne({originalFreet: freet, authorId: author._id}).populate('authorId');


}



  /**
   * Get all the downfreets in the database (i.e. on all Freets by all users)
   *
   * @return {Promise<HydratedDocument<DownFreet>[]>} - An array of all of the downfreets
   */
  static async findAll(): Promise<Array<HydratedDocument<DownFreet>>> {
    // Retrieves downfreets and sorts them from most to least recent
    return DownFreetModel.find({}).sort({dateCreated: -1}).populate('authorId');
  }

  /**
   * Get all the downfreets in by given author
   *
   * @param {string} username - The username of author of the downfreets
   * @return {Promise<HydratedDocument<DownFreet>[]>} - An array of all of the downfreets
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<DownFreet>>> {
    const author = await UserCollection.findOneByUsername(username);
    return DownFreetModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Get all the DownFreets on a Freet
   * 
   * @param {string} freetId - The Id of the Freet
   * @returns Promise<Array<HydratedDocument<DownFreet>>> - An array of all the DownFreets
   */
  static async findAllbyFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<DownFreet>>>{
    const freet = await FreetCollection.findOne(freetId);
    return DownFreetModel.find({originalFreet: freet._id}).populate('_id');
  }

//   /**
//    * Update a freet with the new content - NOT RELEVANT SINCE A DOWNFREET CAN ONLY BE ADDED OR DELETED
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
   * Delete a downfreet with given downfreetId.
   *
   * @param {string} downfreetId - The downfreetId of downfreet to delete
   * @return {Promise<Boolean>} - true if the downfreet has been deleted, false otherwise
   */
  static async deleteOne(downfreetId: Types.ObjectId | string): Promise<boolean> {
    const downfreet = await DownFreetModel.deleteOne({_id: downfreetId});
    return downfreet !== null;
  }

  /**
   * Delete all the downfreets by the given author
   *
   * @param {string} authorId - The id of author of downfreets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await DownFreetModel.deleteMany({authorId});
  }

  /**
   * Delete all the downfreets on a freet
   * @param {string} freetId - The id of the Freet whose downFreets are being deleted
   */
  static async deleteManybyFreetId(freetId: Types.ObjectId | string ):Promise<void>{
    await DownFreetModel.deleteMany({freetId})
  }
}



export default DownFreetCollection;
