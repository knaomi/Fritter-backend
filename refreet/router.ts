import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import ReFreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as refreetValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the refreets
 *
 * @name GET /api/refreets
 *
 * @return {ReFreetResponse[]} - A list of all the refreets sorted in descending
 *                      order by date added
 */
/**
 * Get refreets by author.
 *
 * @name GET /api/refreets?authorId=id
 *
 * @return {ReFreetResponse[]} - An array of refreets created by user with id, authorId
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

    const allReFreets = await ReFreetCollection.findAll();
    const response = allReFreets.map(util.constructReFreetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorReFreets = await ReFreetCollection.findAllByUsername(req.query.author as string);
    const response = authorReFreets.map(util.constructReFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new refreet.
 *
 * @name POST /api/refreets
 *
 * @param {string} freetid - The freet that the user is reFreeting
 * @return {ReFreetResponse} - The created refreet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user had already added a reFreet on the Freet
 * @throws{404} - If the freetid does not exist.
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    refreetValidator.isValidFreetId,
    refreetValidator.isUserAlreadyReFreeting,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const refreet = await ReFreetCollection.addOne(userId, req.body.freetid);

    res.status(201).json({
      message: 'Your refreet was created successfully.',
      refreet: util.constructReFreetResponse(refreet)
    });
  }
);

/**
 * Delete a refreet
 *
 * @name DELETE /api/refreets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the refreet
 * @throws {404} - If the refreetId is not valid
 */
router.delete(
  '/:refreetId?',
  [
    userValidator.isUserLoggedIn,
    refreetValidator.isReFreetExists,
    refreetValidator.isValidReFreetModifier
  ],
  async (req: Request, res: Response) => {
    await ReFreetCollection.deleteOne(req.params.refreetId);
    res.status(200).json({
      message: 'Your refreet was deleted successfully.'
    });
  }
);


export {router as refreetRouter};
