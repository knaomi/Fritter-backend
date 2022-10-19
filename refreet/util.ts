import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {ReFreet, PopulatedReFreet} from '../refreet/model';

// Update this if you add a property to the ReFreet type!
type ReFreetResponse = {
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
 * Transform a raw ReFreet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<ReFreet>} refreet - A refreet
 * @returns {ReFreetResponse} - The refreet object formatted for the frontend
 */
const constructReFreetResponse = (refreet: HydratedDocument<ReFreet>): ReFreetResponse => {
  const refreetCopy: PopulatedReFreet = {
    ...refreet.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = refreetCopy.authorId;
//   const {originalFreet} = refreetCopy.originalFreet;
  delete refreetCopy.authorId;
  return {
    ...refreetCopy,
    _id: refreetCopy._id.toString(),
    author: username,
    // THERE IS THE POTENTIAL TO CHANGE THE BELOW VAR TO THE ACTUAL FREET IN
    // IN THE FRONT END, ESPECIALLY FOR REFREET SINCE IT IS SUPPOSED TO BE THE ORIGINAL FREET THAT IS RECREATED
    originalFreet:refreetCopy.originalFreet._id.toString(),
    dateCreated: formatDate(refreet.dateCreated)
  };
};

export {
  constructReFreetResponse
};
