import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import DownFreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as downfreetValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the downfreets
 *
 * @name GET /api/downfreets
 *
 * @return {DownFreetResponse[]} - A list of all the downfreets sorted in descending
 *                      order by date added
 */
/**
 * Get downfreets by author.
 *
 * @name GET /api/downfreets?authorId=id
 *
 * @return {DownFreetResponse[]} - An array of downfreets created by user with id, authorId
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

    const allDownFreets = await DownFreetCollection.findAll();
    const response = allDownFreets.map(util.constructDownFreetResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
    const authorDownFreets = await DownFreetCollection.findAllByUsername(req.query.author as string);
    const response = authorDownFreets.map(util.constructDownFreetResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new downfreet.
 *
 * @name POST /api/downfreets
 *
 * @param {string} freetId - The freet that the user is downFreeting
 * @return {DownFreetResponse} - The created downfreet
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user had already added a downFreet on the Freet
//  * @throws {400} - If the freet content is empty or a stream of empty spaces
//  * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    // freetValidator.isFreetExists,
    // downfreetValidator.isUserAlreadyDownFreeting,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    // DO CHECKING OF FREET HERE
    
    const downfreet = await DownFreetCollection.addOne(userId, req.body.freetid);

    res.status(201).json({
      message: 'Your downfreet was created successfully.',
      downfreet: util.constructDownFreetResponse(downfreet)
    });
  }
);

/**
 * Delete a downfreet
 *
 * @name DELETE /api/downfreets/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the downfreet
 * @throws {404} - If the downfreetId is not valid
 */
router.delete(
  '/:downfreetId?',
  [
    userValidator.isUserLoggedIn,
    downfreetValidator.isDownFreetExists,
    downfreetValidator.isValidDownFreetModifier
  ],
  async (req: Request, res: Response) => {
    await DownFreetCollection.deleteOne(req.params.downfreetId);
    res.status(200).json({
      message: 'Your downfreet was deleted successfully.'
    });
  }
);

// /** // NOT RELEVANT SINCE A DOWNFREET CANNOT BE MODIFIED
//  * Modify a freet
//  *
//  * @name PUT /api/freets/:id
//  *
//  * @param {string} content - the new content for the freet
//  * @return {FreetResponse} - the updated freet
//  * @throws {403} - if the user is not logged in or not the author of
//  *                 of the freet
//  * @throws {404} - If the freetId is not valid
//  * @throws {400} - If the freet content is empty or a stream of empty spaces
//  * @throws {413} - If the freet content is more than 140 characters long
//  */
// router.put(
//   '/:freetId?',
//   [
//     userValidator.isUserLoggedIn,
//     freetValidator.isFreetExists,
//     freetValidator.isValidFreetModifier,
//     freetValidator.isValidFreetContent
//   ],
//   async (req: Request, res: Response) => {
//     const freet = await FreetCollection.updateOne(req.params.freetId, req.body.content);
//     res.status(200).json({
//       message: 'Your freet was updated successfully.',
//       freet: util.constructFreetResponse(freet)
//     });
//   }
// );

export {router as downfreetRouter};
