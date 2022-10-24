import type {HydratedDocument, Types} from 'mongoose';
import type {BookMarkNest} from './model';
import BookMarkNestModel from './model';
import UserCollection from '../user/collection';
import FreetCollection from '../freet/collection';

/**
 * This files contains a class that has the functionality to explore bookmarknests
 * stored in MongoDB, including adding, finding, and deleting bookmarks.
 *
 */
class BookMarkNestCollection {
  /**
   * Add a bookmarknest to the collection
   *
   * @param {string} authorId - The id of the author of the bookmarknest
   * @param {string} nestname - The name of the BookMarkNest
   * @param {boolean} defaultRootNest - If the nest will be the root nest of the author
   * @return {Promise<HydratedDocument<BookMarkNest>>} - The newly created bookmarknest
   */
  static async addOne(authorId: Types.ObjectId | string, nestname: Types.ObjectId | string, defaultRootNest: boolean = false): Promise<HydratedDocument<BookMarkNest>> {
    const date = new Date();
    const bookmarknest = new BookMarkNestModel({
      nestname,
      authorId,
      defaultRootNest,
      dateCreated: date
    });
    await bookmarknest.save(); // Saves bookmark to MongoDB
    return bookmarknest.populate('authorId');
  }

/**
   * Find a bookmarknest by bookmarknest Id
   *
   * @param {string} bookmarknestId - The id of the bookmarknest to find
   * @return {Promise<HydratedDocument<BookMarkNest>> | Promise<null> } - The bookmarknest with the given bookmarknestId, if any
   */
 static async findOne(bookmarknestId: Types.ObjectId | string): Promise<HydratedDocument<BookMarkNest>> {
    return BookMarkNestModel.findOne({_id: bookmarknestId}).populate('authorId');
  }

/**
   * Find a bookmarknest by nestname for a given author
   * @param {string} nestname - The name of the bookmarknest to find
   * @param {string} authorId - The id of the author of the bookmarknest to find
   * @return {Promise<HydratedDocument<BookMarkNest>> | Promise<null> } - The bookmarknest with the given bookmarknestId, if any
   */
 static async findOneByNestName(nestname: string, authorId: Types.ObjectId | string): Promise<HydratedDocument<BookMarkNest>> {
    const author = await UserCollection.findOneByUserId(authorId);
    return BookMarkNestModel.findOne({nestname: nestname, authorId: author._id}).populate('authorId');


  }

/**
   * Get all the bookmarknests in by given author 
   *
   * @param {string} userId - The id of author of the bookmarks
   * @return {Promise<HydratedDocument<BookMark>[]>} - An array of all of the bookmarks
   */
 static async findAllByUserId(userId: Types.ObjectId |string): Promise<Array<HydratedDocument<BookMarkNest>>> {
  const author = await UserCollection.findOneByUserId(userId);
  return BookMarkNestModel.find({authorId: author._id, expiringDate: {$gt: new Date()}}).populate('authorId');
}

  /**
   * Get all the bookmarknests in the database (i.e. by all users)
   *
   * @return {Promise<HydratedDocument<BookMarkNest>[]>} - An array of all of the bookmarknests
   */
  static async findAll(): Promise<Array<HydratedDocument<BookMarkNest>>> {
    // Retrieves bookmarknests and sorts them from most to least recent
    return BookMarkNestModel.find({}).sort({dateCreated: -1}).populate('authorId');
  }

  /**
   * Get all the bookmarknests in by given author
   *
   * @param {string} username - The username of author of the bookmarknests
   * @return {Promise<HydratedDocument<BookMarkNest>[]>} - An array of all of the bookmarknests
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<BookMarkNest>>> {
    const author = await UserCollection.findOneByUsername(username);
    return BookMarkNestModel.find({authorId: author._id}).populate('authorId');
  }

//   /**
//    * Get all the BookMarkNests that contain a Freet
//    * 
//    * @param {string} freetId - The Id of the Freet
//    * @returns Promise<Array<HydratedDocument<BookMarkNest>>> - An array of all the BookMarkNests
//    */
//   static async findAllbyFreetId(freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<BookMarkNest>>>{
//     const freet = await FreetCollection.findOne(freetId);
//     return BookMarkNestModel.find({bookmarks: freet._id}).populate('_id');
//   }

  /**
   * Delete a bookmarknest with given bookmarknestId.
   *
   * @param {string} bookmarknestId - The bookmarknestId of bookmarknest to delete
   * @return {Promise<Boolean>} - true if the bookmarknest has been deleted, false otherwise
   */
  static async deleteOne(bookmarknestId: Types.ObjectId | string): Promise<boolean> {
    const bookmarknest = await BookMarkNestModel.deleteOne({_id: bookmarknestId});
    return bookmarknest !== null;
  }

  /**
   * Delete all the bookmarknests by the given author
   *
   * @param {string} authorId - The id of author of bookmarknests
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await BookMarkNestModel.deleteMany({authorId});
  }



}


export default BookMarkNestCollection;
