import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import FreetDraftCollection from '../freetdraft/collection';

/**
 * Checks if a freetdraft with freetdraftId is req.params exists
 */
const isFreetDraftExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetdraftId);
  const freetdraft = validFormat ? await FreetDraftCollection.findOne(req.params.freetdraftId) : '';
  if (!freetdraft) {
    res.status(404).json({
      error: {
        freetdraftNotFound: `FreetDraft with freetdraft ID ${req.params.freetdraftId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freetdraft in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetDraftContent = (req: Request, res: Response, next: NextFunction) => {
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'FreetDraft content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'FreetDraft content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the freetdraft whose freetdraftId is in req.params
 */
const isValidFreetDraftModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freetdraft = await FreetDraftCollection.findOne(req.params.freetdraftId);
  const userId = freetdraft.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freetdrafts.' // CHANGE THIS ERROR MESSAGE TO SOMETHING ELSE
    });
    return;
  }

  next();
};

export {
  isValidFreetDraftContent,
  isFreetDraftExists,
  isValidFreetDraftModifier
};
