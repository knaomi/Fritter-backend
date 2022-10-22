import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {BookMark, PopulatedBookMark} from '../bookmark/model';

// Update this if you add a property to the BookMark type!
type BookMarkResponse = {
  _id: string;
  author: string;
  originalFreet: string;
  dateCreated: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw BookMark object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<BookMark>} bookmark - A bookmark
 * @returns {BookMarkResponse} - The bookmark object formatted for the frontend
 */
const constructBookMarkResponse = (bookmark: HydratedDocument<BookMark>): BookMarkResponse => {
  const bookmarkCopy: PopulatedBookMark = {
    ...bookmark.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = bookmarkCopy.authorId;
//   const {originalFreet} = bookmarkCopy.originalFreet;
  delete bookmarkCopy.authorId;
  return {
    ...bookmarkCopy,
    _id: bookmarkCopy._id.toString(),
    author: username,
    originalFreet:bookmarkCopy.originalFreet._id.toString(),
    dateCreated: formatDate(bookmark.dateCreated)
  };
};

export {
  constructBookMarkResponse
};
