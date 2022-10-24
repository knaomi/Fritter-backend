import type {HydratedDocument, Types} from 'mongoose';
import type {BookMark} from './model';
import BookMarkModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';
import BookMarkNestCollection from '../bookmarknest/collection';


/**
 * This files contains a class that has the functionality to explore bookmarks
 * stored in MongoDB, including adding, finding, and deleting bookmarks.
 *
 */
class BookMarkCollection {
  /**
   * Add a bookmark to the collection
   *
   * @param {string} authorId - The id of the author of the bookmark
   * @param{string} nestId - The id of the bookmarknest you are adding the bookmark to.
   * @param {string} originalFreet - The id of the originalFreet
   * @return {Promise<HydratedDocument<BookMark>>} - The newly created bookmark
   */
  static async addOne(authorId: Types.ObjectId | string, nestId: Types.ObjectId | string,originalFreet: Types.ObjectId | string): Promise<HydratedDocument<BookMark>> {
    const date = new Date();
    const bookmark = new BookMarkModel({
      authorId,
      nestId,
      originalFreet,
      dateCreated: date,
      expiringDate: (await FreetCollection.findOne(originalFreet))?.expiringDate,
    });
    await bookmark.save(); // Saves bookmark to MongoDB
    return bookmark.populate('authorId');
  }

  /**
   * Find a bookmark by bookmark Id
   *
   * @param {string} bookmarkId - The id of the bookmark to find
   * @return {Promise<HydratedDocument<BookMark>> | Promise<null> } - The bookmark with the given bookmarkId, if any
   */
  static async findOne(bookmarkId: Types.ObjectId | string): Promise<HydratedDocument<BookMark>> {
    return BookMarkModel.findOne({_id: bookmarkId, expiringDate: {$gt: new Date()}} ).populate('authorId');
  }

  /**
   * Get all the bookmarks in the database (i.e. on all Freets by all users)
   *
   * @return {Promise<HydratedDocument<BookMark>[]>} - An array of all of the bookmarks
   */
  static async findAll(): Promise<Array<HydratedDocument<BookMark>>> {
    // Retrieves bookmarks and sorts them from most to least recent
    return BookMarkModel.find({expiringDate: {$gt: new Date()}}).sort({dateCreated: -1}).populate('authorId');
  }

  /**
   * Get all the bookmarks in by given author
   *
   * @param {string} username - The username of author of the bookmarks
   * @return {Promise<HydratedDocument<BookMark>[]>} - An array of all of the bookmarks
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<BookMark>>> {
    const author = await UserCollection.findOneByUsername(username);
    return BookMarkModel.find({authorId: author._id, expiringDate: {$gt: new Date()}}).populate('authorId');
  }

  /**
   * Get all the bookmarks in a bookmarknest.
   *
   * @param {string} nestId - The nestId of the bookmarknest
   * @return {Promise<HydratedDocument<BookMark>[]>} - An array of all of the bookmarks
   */
   static async findAllByNestId(nestId:Types.ObjectId | string): Promise<Array<HydratedDocument<BookMark>>> {
    const nest = await BookMarkNestCollection.findOne(nestId);
    return BookMarkModel.find({nestId: nest._id, expiringDate: {$gt: new Date()}}).populate('nestId');
  }

  /**
   * Get all the BookMarks on a Freet
   * 
   * @param {string} freetId - The Id of the Freet
   * @returns Promise<Array<HydratedDocument<BookMark>>> - An array of all the BookMarks
   */
  static async findAllbyFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<BookMark>>>{
    const freet = await FreetCollection.findOne(freetId);
    return BookMarkModel.find({originalFreet: freet._id}).populate('_id');
  }

  /**
   * Delete a bookmark with given bookmarkId.
   *
   * @param {string} bookmarkId - The bookmarkId of bookmark to delete
   * @return {Promise<Boolean>} - true if the bookmark has been deleted, false otherwise
   */
  static async deleteOne(bookmarkId: Types.ObjectId | string): Promise<boolean> {
    const bookmark = await BookMarkModel.deleteOne({_id: bookmarkId});
    return bookmark !== null;
  }

  /**
   * Delete all the bookmarks by the given author
   *
   * @param {string} authorId - The id of author of bookmarks
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await BookMarkModel.deleteMany({authorId});
  }

  /**
   * Delete all the bookmarks on a freet
   * @param {string} freetId - The id of the Freet whose bookMarks are being deleted
   */
  static async deleteManybyFreetId(freetId: Types.ObjectId | string ):Promise<void>{
    await BookMarkModel.deleteMany({freetId})
  }
  /**
    * Delete all the Bookmarks in a BookNest
    * @param {string} bookmarknestId - the id of the Nest whose bookMarks are being deleted 
    */
   static async deleteManybyBookMarkNestId(bookmarknestId: Types.ObjectId | string ):Promise<void>{
    await BookMarkModel.deleteMany({bookmarknestId})
  }  

 /**
   * Delete all the bookmarks on expired freets 
   *
   */
  static async deleteManybyExpiration(): Promise<void> {
    await BookMarkModel.deleteMany({expiringDate: {$lte: new Date()}});
  }

}






export default BookMarkCollection;
