import type {HydratedDocument, Types} from 'mongoose';
import type {FreetDraft} from './model';
import FreetDraftModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freetdrafts
 * stored in MongoDB, including adding, finding, updating, and deleting freetdrafts.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<FreetDraft> is the output of the FreetDraftModel() constructor,
 * and contains all the information in FreetDraft. https://mongoosejs.com/docs/typescript.html
 */
class FreetDraftCollection {
  /**
   * Add a freetdraft to the collection 
   * 
   * (AT THE MOMENT: WITHOUT SCHEDULED POSTING TIME OR DESTROYING TIME AFTER POSTING)
   *
   * @param {string} authorId - The id of the author of the freetdraft
   * @param {string} content - The id of the content of the freetdraft
   * @return {Promise<HydratedDocument<FreetDraft>>} - The newly created freetdraft
   */
  static async addOne(authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<FreetDraft>> {
    const date = new Date();
    const freetdraft = new FreetDraftModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date
    });
    await freetdraft.save(); // Saves freetdraft to MongoDB
    return freetdraft.populate('authorId');
  }

  /**
   * Find a freetdraft by freetdraftId
   *
   * @param {string} freetdraftId - The id of the freetdraft to find
   * @return {Promise<HydratedDocument<FreetDraft>> | Promise<null> } - The freetdraft with the given freetdraftId, if any
   */
  static async findOne(freetdraftId: Types.ObjectId | string): Promise<HydratedDocument<FreetDraft>> {
    return FreetDraftModel.findOne({_id: freetdraftId}).populate('authorId');
  }


  /**
   * Get all the freetdrafts in the database
   *
   * @return {Promise<HydratedDocument<FreetDraft>[]>} - An array of all of the freetdrafts
   */
  static async findAll(): Promise<Array<HydratedDocument<FreetDraft>>> {
    // Retrieves freetdrafts and sorts them from most to least recent
    return FreetDraftModel.find({}).sort({dateModified: -1}).populate('authorId');
  }

  /**
   * Get all the freetdrafts in by given author
   *
   * @param {string} username - The username of author of the freetdrafts
   * @return {Promise<HydratedDocument<FreetDraft>[]>} - An array of all of the freetdrafts
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<FreetDraft>>> {
    const author = await UserCollection.findOneByUsername(username);
    return FreetDraftModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Get all the freetdrafts in by given author
   *
   * @param {string} userid - The userid of author of the freetdrafts
   * @return {Promise<HydratedDocument<FreetDraft>[]>} - An array of all of the freetdrafts
   */
   static async findAllByAuthorId(userid: Types.ObjectId |string): Promise<Array<HydratedDocument<FreetDraft>>> {
    const author = await UserCollection.findOneByUserId(userid);
    return FreetDraftModel.find({authorId: author._id}).populate('authorId');
  }

  /**
   * Update a freetdraft with the new content
   *
   * @param {string} freetdraftId - The id of the freetdraft to be updated
   * @param {string} content - The new content of the freetdraft
   * @return {Promise<HydratedDocument<FreetDraft>>} - The newly updated freetdraft
   */
  static async updateOne(freetdraftId: Types.ObjectId | string, content: string): Promise<HydratedDocument<FreetDraft>> {
    const freetdraft = await FreetDraftModel.findOne({_id: freetdraftId});
    freetdraft.content = content;
    freetdraft.dateModified = new Date();
    await freetdraft.save();
    return freetdraft.populate('authorId');
  }

  /**
   * Delete a freetdraft with given freetdraftId.
   *
   * @param {string} freetdraftId - The freetdraftId of freetdraft to delete
   * @return {Promise<Boolean>} - true if the freetdraft has been deleted, false otherwise
   */
  static async deleteOne(freetdraftId: Types.ObjectId | string): Promise<boolean> {
    const freetdraft = await FreetDraftModel.deleteOne({_id: freetdraftId});
    return freetdraft !== null;
  }

  /**
   * Delete all the freetdrafts by the given author
   *
   * @param {string} authorId - The id of author of freetdrafts
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetDraftModel.deleteMany({authorId});
  }
}

export default FreetDraftCollection;
