import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BookMarkCollection from './collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a bookmark with bookmarkId is req.params exists
 */
const isBookMarkExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.bookmarkId);
  const bookmark = validFormat ? await BookMarkCollection.findOne(req.params.bookmarkId) : '';
  if (!bookmark) {
    res.status(404).json({
      error: {
        bookmarkNotFound: `BookMark with bookmark ID ${req.params.bookmarkId} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * Check if the user already bookmarked the freet.
 */
const isUserAlreadyBookMarking = async (req: Request, res: Response, next: NextFunction) => {
    const freet = await FreetCollection.findOne(req.body.freetid);
    const bookmarksOnFreet = await BookMarkCollection.findAllbyFreetId(freet._id);
    for (const bookmark of bookmarksOnFreet){
      if (bookmark.authorId._id.toString() === req.session.userId){
        res.status(400).json({
          error: 'user is not allowed to bookmark a Freet more than once'
      })
        return;
      };
    };
    next();
}


/**
 * Checks if the freetid in req.body is valid.
 */
const isValidFreetId = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.freetid);
  const freet = validFormat ? await FreetCollection.findOne(req.body.freetid) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.body.freetid} does not exist.`
      }
    });
    return;
  };
  next();
};

/**
 * Checks if the current user is the author of the bookmark whose freetId is in req.params
 */
const isValidBookMarkModifier = async (req: Request, res: Response, next: NextFunction) => {
  const bookmark = await BookMarkCollection.findOne(req.params.bookmarkId);
  const userId = bookmark.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' bookmarks.'
    });
    return;
  }

  next();
};

export {
  isValidFreetId,
  isBookMarkExists,
  isValidBookMarkModifier,
  isUserAlreadyBookMarking,
};
