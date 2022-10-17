import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {DownFreet, PopulatedDownFreet} from '../downfreet/model';

// Update this if you add a property to the DownFreet type!
type DownFreetResponse = {
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
 * Transform a raw DownFreet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<DownFreet>} downfreet - A downfreet
 * @returns {DownFreetResponse} - The downfreet object formatted for the frontend
 */
const constructDownFreetResponse = (downfreet: HydratedDocument<DownFreet>): DownFreetResponse => {
  const downfreetCopy: PopulatedDownFreet = {
    ...downfreet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = downfreetCopy.authorId;
//   const {originalFreet} = downfreetCopy.originalFreet;
  delete downfreetCopy.authorId;
  return {
    ...downfreetCopy,
    _id: downfreetCopy._id.toString(),
    author: username,
    originalFreet:downfreetCopy.originalFreet._id.toString(),
    dateCreated: formatDate(downfreet.dateCreated)
  };
};

export {
  constructDownFreetResponse
};
