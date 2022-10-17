import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import DownFreetCollection from './collection';

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


const isUserAlreadyDownFreeting = async (req: Request, res: Response, next: NextFunction) => {
    // const downfreet = await DownFreetCollection.findOne(req.params.downfreetId);
    // const userId = downfreet.authorId._id;
    const authorDownFreets = await DownFreetCollection.findAllByUsername(req.query.author as string);

   for (const downfreet of authorDownFreets){
        if (downfreet.originalFreet._id === req.body.freetId){
            res.status(400).json({
              error: 'user is not allowed to downfreet a Freet more than once'
           })
        };
        return;
   }
    next();
  };
  
 

// /**
//  * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
//  * spaces and not more than 140 characters
//  */
// const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
//   const {content} = req.body as {content: string};
//   if (!content.trim()) {
//     res.status(400).json({
//       error: 'Freet content must be at least one character long.'
//     });
//     return;
//   }

//   if (content.length > 140) {
//     res.status(413).json({
//       error: 'Freet content must be no more than 140 characters.'
//     });
//     return;
//   }

//   next();
// };

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

export {
//   isValidFreetContent,
  isDownFreetExists,
  isValidDownFreetModifier,
//   isUserAlreadyDownFreeting,
};
