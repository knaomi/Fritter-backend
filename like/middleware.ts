import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import LikeCollection from './collection';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';

/**
 * Checks if a like with likeId is req.params exists
 */
const isLikeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.likeId);
  const like = validFormat ? await LikeCollection.findOne(req.params.likeId) : '';
  if (!like) {
    res.status(404).json({
      error: {
        likeNotFound: `Like with like ID ${req.params.likeId} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * Check if the user already liked the freet.
 */
const isUserAlreadyLiking = async (req: Request, res: Response, next: NextFunction) => {
    const freet = await FreetCollection.findOne(req.body.freetid);
    const likesOnFreet = await LikeCollection.findAllbyFreetId(freet._id);
    for (const like of likesOnFreet){
      if (like.authorId._id.toString() === req.session.userId){
        res.status(400).json({
          error: 'user is not allowed to like a Freet more than once'
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
 * Checks if the current user is the author of the like whose freetId is in req.params
 */
const isValidLikeModifier = async (req: Request, res: Response, next: NextFunction) => {
  const like = await LikeCollection.findOne(req.params.likeId);
  const userId = like.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' likes.'
    });
    return;
  }

  next();
};
/**
 * Checks if a user with userId as author id in req.query exists
 */
 const isAuthorExists = async (req: Request, res: Response, next: NextFunction) => {
  
  if (req.query.freet !== undefined){
    next();
    return;
  }
  else{
    if (!req.query.author) {
      res.status(400).json({
        error: 'Provided author username must be nonempty.'
      });
      return;
    }

    const user = await UserCollection.findOneByUsername(req.query.author as string);
    if (!user) {
      res.status(404).json({
        error: `A user with username ${req.query.author as string} does not exist.`
      });
      return;
    }
  }

  next();
};
export {
  isValidFreetId,
  isLikeExists,
  isValidLikeModifier,
  isUserAlreadyLiking,
  isAuthorExists,
};
