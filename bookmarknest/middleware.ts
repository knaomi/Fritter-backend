// CHECKS NEEDED
// can change nestname to same old one

import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BookMarkNestCollection from './collection';
import FreetCollection from '../freet/collection';
import UserCollection from '../user/collection';


/**
 * Checks if a nestname in req.body is valid, that is, it matches the nestname regex
 */
const isValidNestname = (req: Request, res: Response, next: NextFunction) => {
    const nestnameRegex = /^\w+$/i;
    if (!nestnameRegex.test(req.body.nestname)) {
      res.status(400).json({
        error: {
          nestname: 'Nestname must be a nonempty alphanumeric string.'
        }
      });
      return;
    }
  
    next();
};

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
 * Checks if a bookmarknest with bookmarknestId is req.params exists
 */
const isBookMarkNestExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.bookmarknestId);
  const bookmarknest = validFormat ? await BookMarkNestCollection.findOne(req.params.bookmarknestId) : '';
  if (!bookmarknest) {
    res.status(404).json({
      error: {
        bookmarkNestNotFound: `BookMarkNest with bookmarknest ID ${req.params.bookmarknestId} does not exist.`
      }
    });
    return;
  }
  next();
};

// /**
//  * Checks if a bookmarknest with  bookmarknestId is req.params is the root bookmarknest a.k.a folder.
//  * 
//  * This is only called in functions that modify the bookmark nest such as edit name, or delete
//  */
//  const isBookMarkNestTheRoot = async (req: Request, res: Response, next: NextFunction) => {
//     const validFormat = Types.ObjectId.isValid(req.params.bookmarknestId);
//     const bookmarknest = validFormat ? await BookMarkNestCollection.findOne(req.params.bookmarknestId) : '';
//     if (bookmarknest && bookmarknest.defaultRootNest) {
//       res.status(404).json({
//         error: {
//           bookmarkNestRootError: `The root (default) BookMarkNest with bookmarknest ID ${req.params.bookmarknestId} cannot be modified by a user.`
//         }
//       });
//       return;
//     }
//     next();
//   };

/**
 * Checks if a bookmarknest with  bookmarknestId is req.params is the root bookmarknest a.k.a folder.
 * 
 * This is only called in functions that modify the bookmark nest such as edit name, or delete
 */
 const isBookMarkNestTheRoot = async (bookmarknestId:Types.ObjectId|string) => {
    const validFormat = Types.ObjectId.isValid(bookmarknestId);
    const bookmarknest = validFormat ? await BookMarkNestCollection.findOne(bookmarknestId) : '';
    if (bookmarknest!== '' && bookmarknest.defaultRootNest) {
      return true;
    }
    return false;
    
  };



/**
 * Checks if a username in req.body is already in use
 */
 const isNestnameNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
    const nest = await BookMarkNestCollection.findOneByNestName(req.body.nestname, req.session.userId as string);

    // // If the current session user wants to change a nestname to one which matches
    // // the current one of the bookmarknest irrespective of the case, we should allow them to do so
    // if (!nest || (nest?.nestname.toString() === req.body.nestname)) {
    //     next();
    //     return;
    // }
    // if (!nest){
    //     next();
    //     return;
    // }

    if (nest){
        res.status(409).json({
        error: {
            nestname: 'A BookMark with this nestname already exists.'     
        }
        });
        return; 
    }
    next()
    
  };

  const isValidBookMarkNestViewer = async (req: Request, res: Response, next: NextFunction) => {
    // const bookmarknest = await BookMarkNestCollection.findOne(req.params.bookmarknestId);
    // const userId = bookmarknest.authorId._id;
    const author = await UserCollection.findOneByUsername(req.query.author as string);
    // const author = await UserCollection.findOneByUsername(username);
    console.log("session id of user", req.session.userId)
    console.log(" id  of user", author)
    if (req.session.userId !== author._id.toString()) {
      res.status(403).json({
        error: 'Cannot view other users\' bookmarknests.'
      });
      return;
    }
  
    next();
  };


/**
 * Checks if the current user is the author of the bookmarknest whose bookmarknestId is in req.params
 */
const isValidBookMarkNestModifier = async (req: Request, res: Response, next: NextFunction) => {
  const bookmarknest = await BookMarkNestCollection.findOne(req.params.bookmarknestId);
  const userId = bookmarknest.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot  View other users\' bookmarknests.'
    });
    return;
  }

  next();
};

export {
  isValidNestname,
  isBookMarkNestExists,
  isBookMarkNestTheRoot,
  isNestnameNotAlreadyInUse, 
  isValidBookMarkNestViewer,
  isValidBookMarkNestModifier,
  isValidFreetId,
};
