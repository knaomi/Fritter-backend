import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import DownFreetCollection from './collection';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';

/**
 * Checks if a downfreet with downfreetId is req.params exists
 */
const isDownFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.downfreetId);
  const downfreet = validFormat ? await DownFreetCollection.findOne(req.params.downfreetId) : '';
  if (!downfreet) {
    res.status(404).json({
      error: {
        downfreetNotFound: `DownFreet with downfreet ID ${req.params.downfreetId} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * Check if the user already downfreeted the freet.
 */
const isUserAlreadyDownFreeting = async (req: Request, res: Response, next: NextFunction) => {
    const freet = await FreetCollection.findOne(req.body.freetid);
    const downfreetsOnFreet = await DownFreetCollection.findAllbyFreetId(freet._id);
    for (const downfreet of downfreetsOnFreet){
      if (downfreet.authorId._id.toString() === req.session.userId){
        res.status(400).json({
          error: 'user is not allowed to downfreet a Freet more than once'
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
 * Checks if the current user is the author of the downfreet whose freetId is in req.params
 */
const isValidDownFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const downfreet = await DownFreetCollection.findOne(req.params.downfreetId);
  const userId = downfreet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' downfreets.'
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
  isDownFreetExists,
  isValidDownFreetModifier,
  isUserAlreadyDownFreeting,
  isAuthorExists,
};
