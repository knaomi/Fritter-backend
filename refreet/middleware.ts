import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReFreetCollection from './collection';
import FreetCollection from '../freet/collection';

/**
 * Checks if a refreet with refreetId is req.params exists
 */
const isReFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.refreetId);
  const refreet = validFormat ? await ReFreetCollection.findOne(req.params.refreetId) : '';
  if (!refreet) {
    res.status(404).json({
      error: {
        refreetNotFound: `ReFreet with refreet ID ${req.params.refreetId} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * Check if the user already refreeted the freet.
 */
const isUserAlreadyReFreeting = async (req: Request, res: Response, next: NextFunction) => {
    const freet = await FreetCollection.findOne(req.body.freetid);
    const refreetsOnFreet = await ReFreetCollection.findAllbyFreetId(freet._id);
    for (const refreet of refreetsOnFreet){
      if (refreet.authorId._id.toString() === req.session.userId){
        res.status(400).json({
          error: 'user is not allowed to refreet a Freet more than once'
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
 * Checks if the current user is the author of the refreet whose freetId is in req.params
 */
const isValidReFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const refreet = await ReFreetCollection.findOne(req.params.refreetId);
  const userId = refreet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' refreets.'
    });
    return;
  }

  next();
};

export {
  isValidFreetId,
  isReFreetExists,
  isValidReFreetModifier,
  isUserAlreadyReFreeting,
};
