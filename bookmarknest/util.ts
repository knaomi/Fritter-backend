import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {BookMarkNest, PopulatedBookMarkNest} from '../bookmarknest/model';

// Update this if you add a property to the BookMarkNest type!
type BookMarkNestResponse = {
  _id: string;
  nestname: string,
  author: string;
  defaultRootNest: string;
  dateCreated: string;
  bookmarks: string;

};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw BookMarkNest object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<BookMarkNest>} bookmarknest - A bookmarknest
 * @returns {BookMarkNestResponse} - The bookmarknest object formatted for the frontend
 */
const constructBookMarkNestResponse = (bookmarknest: HydratedDocument<BookMarkNest>): BookMarkNestResponse => {
  const bookmarknestCopy: PopulatedBookMarkNest = {
    ...bookmarknest.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = bookmarknestCopy.authorId;
  delete bookmarknestCopy.authorId;
  return {
    ...bookmarknestCopy,
    _id: bookmarknestCopy._id.toString(),
    nestname: bookmarknestCopy.nestname,
    author: username,
    defaultRootNest: bookmarknestCopy.defaultRootNest.toString(),
    dateCreated: formatDate(bookmarknest.dateCreated),
    bookmarks: bookmarknestCopy.bookmarks?.toString(),
  };
};

export {
  constructBookMarkNestResponse
};
