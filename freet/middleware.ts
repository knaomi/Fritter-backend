import type {Request, Response, NextFunction} from 'express';
import mongoose, {MongooseError, Types} from 'mongoose';
import FreetCollection from '../freet/collection';
import moment, { invalid } from 'moment';


/**
 * Checks if a freet with freetId is req.params exists
 */
const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.freetId);
  const freet = validFormat ? await FreetCollection.findOne(req.params.freetId) : '';
  if (!freet) {
    res.status(404).json({
      error: {
        freetNotFound: `Freet with freet ID ${req.params.freetId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the content of the freet in req.body is valid, i.e not a stream of empty
 * spaces and not more than 140 characters
 */
const isValidFreetContent = (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body)
  const {content} = req.body as {content: string};
  if (!content.trim()) {
    res.status(400).json({
      error: 'Freet content must be at least one character long.'
    });
    return;
  }

  if (content.length > 140) {
    res.status(413).json({
      error: 'Freet content must be no more than 140 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if the expiration date of the freet in req.query is valid
 * i.e. year >= new Date().year, 1<=month<=12, 1<=day <=31
 */
 const isValidExpiringDate = async (req: Request, res: Response, next: NextFunction) => {
  // console.log("req.query", req.query)
  // const expirationdate = req.query.expiringdate;
  // const expiringtime = req.query.expiringtime;
  // const date  = expirationdate + 'T' + expiringtime + ':00Z' ;
  // console.log("date created", new Date(date), date)

  const expiringyear=req.query.expiringyear;
  const expiringmonth = req.query.expiringmonth;
  const expiringdate = req.query.expiringdate;
  const expiringhour = req.query.expiringhour;
  const expiringminute = req.query.expiringminute;

  const date = moment(expiringyear+"-"+expiringmonth+"-"+expiringdate+"T"+expiringhour+":"+expiringminute)
  if (!date.isValid()){
    res.status(412).json({
      error: "A correct date format must be provided that is not set in the past"
    });
    return; 
  }  
  // else if (date <= moment()){
  //   res.status(400).json({
  //     error: "One cannot set an expiration date that is in the past"
  //   });
  //   return; 
  // }
  next();


  // const freet = await FreetCollection.addOne(req.session.userId, "test run ", new Date(date));
  // if (freet.validateSync().errors['expiringDate'] instanceof mongoose.Error.ValidatorError){
  //   console.log("error found", typeof freet.validateSync().errors["expiringDate"] )
  //   // await FreetCollection.deleteOne(freet._id)
  //   res.status(400).json({
  //     error: "A correct date format must be provided and one that is not in the past"
  //   });
  //   return;
  // }
  // await FreetCollection.deleteOne(freet._id);
  // next();
};

/**
 * Checks if the current user is the author of the freet whose freetId is in req.params
 */
const isValidFreetModifier = async (req: Request, res: Response, next: NextFunction) => {
  const freet = await FreetCollection.findOne(req.params.freetId);
  const userId = freet.authorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' freets.'
    });
    return;
  }

  next();
};

export {
  isValidFreetContent,
  isFreetExists,
  isValidFreetModifier,
  isValidExpiringDate,
};
