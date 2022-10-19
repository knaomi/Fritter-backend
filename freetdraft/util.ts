import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {FreetDraft, PopulatedFreetDraft} from '../freetdraft/model';

// Update this if you add a property to the Freet type!
type FreetDraftResponse = {
  _id: string;
  author: string;
  dateCreated: string;
  content: string;
  dateModified: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw FreetDraft object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<FreetDraft>} freetdraft - A freetdraft
 * @returns {FreetDraftResponse} - The freetdraft object formatted for the frontend
 */
const constructFreetDraftResponse = (freetdraft: HydratedDocument<FreetDraft>): FreetDraftResponse => {
  const freetdraftCopy: PopulatedFreetDraft = {
    ...freetdraft.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = freetdraftCopy.authorId;
  delete freetdraftCopy.authorId;
  return {
    ...freetdraftCopy,
    _id: freetdraftCopy._id.toString(),
    author: username,
    dateCreated: formatDate(freetdraft.dateCreated),
    dateModified: formatDate(freetdraft.dateModified)
  };
};

export {
  constructFreetDraftResponse
};
