import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import DownFreetCollection from '../downfreet/collection';
import * as userValidator from '../user/middleware';
import * as likeValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the likes for user signed in
 *
 * @name GET /api/likes
 *
 * @return {LikeResponse[]} - A list of all the likes sorted in descending
 *                      order by date added
 * @throws {403} - If the user is not logged in

 */
/**
 * Get likes by author.
 *
 * @name GET /api/likes?authorId=id
 *
 * @return {LikeResponse[]} - An array of likes created by user with id, authorId
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */

/**
 * Get (number of) likes on freet.
 *
 * @name GET /api/likes?freetId=id
 *
 * @return {Array<HydratedDocument<DownFreet>>} - (Number of likes) created on freet with id, freetId
 * @throws {400} - If freetId is not given
 * @throws {404} - If no freet has given freetId
 *
 */

router.get(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId  and freetId query parameters was supplied
    if (req.query.author !== undefined  || req.query.freet !== undefined) { 
      next();
      return;
    }

    // const allLikes = await LikeCollection.findAll();
    // const response = allLikes.map(util.constructLikeResponse);
    // res.status(200).json(response);
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const authorLikes = await LikeCollection.findAllByUserId(userId);
    const response = authorLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  },
  [
    likeValidator.isAuthorExists,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.freet !== undefined){
      next();
      return;
    }
    const authorLikes = await LikeCollection.findAllByUsername(req.query.author as string);
    const response = authorLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  },
  [
    freetValidator.isFreetQueryExists,
  ],
  async (req: Request, res: Response) => {
   
    const freetLikes = await LikeCollection.findAllbyFreetId(req.query.freet as string);
    res.status(200).json(freetLikes);
  }
);


// );

/**
 * Create a new like.
 *
 * @name POST /api/likes
 *
 * @param {string} freetid - The freet that the user is Liking
 * @return {LikeResponse} - The created like
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user had already added a Like on the Freet
 * @throws{404} - If the freetid does not exist.
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isValidFreetId,
    likeValidator.isUserAlreadyLiking,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const like = await LikeCollection.addOne(userId, req.body.freetid);
    const downFreetOnFreet = await DownFreetCollection.findOneByFreetId(req.body.freetid, userId);
    if (downFreetOnFreet){
      await DownFreetCollection.deleteOne(downFreetOnFreet._id);
      res.status(201).json({
        message: 'The previous downFreet was deleted successfully \n'+
            'and Your like was created successfully.',
        like: util.constructLikeResponse(like)
      });     
    }
    else{
      res.status(201).json({
        message: 'Your like was created successfully.',
        like: util.constructLikeResponse(like)
      });
    }
  }
);

/**
 * Delete a like
 *
 * @name DELETE /api/like/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the like
 * @throws {404} - If the likeId is not valid
 */
router.delete(
  '/:likeId?',
  [
    userValidator.isUserLoggedIn,
    likeValidator.isLikeExists,
    likeValidator.isValidLikeModifier
  ],
  async (req: Request, res: Response) => {
    await LikeCollection.deleteOne(req.params.likeId);
    await LikeCollection.deleteManybyExpiration();
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);


export {router as likeRouter};
