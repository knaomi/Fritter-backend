import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import LikeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as likeValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the likes
 *
 * @name GET /api/likes
 *
 * @return {LikeResponse[]} - A list of all the likes sorted in descending
 *                      order by date added
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
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }

    const allLikes = await LikeCollection.findAll();
    const response = allLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorLikes = await LikeCollection.findAllByUsername(req.query.author as string);
    const response = authorLikes.map(util.constructLikeResponse);
    res.status(200).json(response);
  }
);

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
    console.log("got to router")
    res.status(201).json({
      message: 'Your like was created successfully.',
      like: util.constructLikeResponse(like)
    });
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
    res.status(200).json({
      message: 'Your like was deleted successfully.'
    });
  }
);


export {router as likeRouter};
