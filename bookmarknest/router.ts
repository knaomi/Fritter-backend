import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BookMarkNestCollection from './collection';
import * as userValidator from '../user/middleware';
import * as bookmarknestValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

// CHANGES NEEDED
// Add method for get bookmark by nestid
/**
 * Get all the bookmarknests
 *
 * @name GET /api/bookmarknests
 *
 * @return {BookMarkNestResponse[]} - A list of all the bookmarknests sorted in descending
 *                      order by date added
 */
/**
 * Get bookmarknests by author.
 *
 * @name GET /api/bookmarknests?authorId=id
 *
 * @return {BookMarkNestResponse[]} - An array of bookmarknests created by user with id, authorId
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
    // ADD CHECK SO THAT ALL BOOKMARKNESTS ARE ONLY THOSE OF THE USER
    const allBookMarkNests = await BookMarkNestCollection.findAll();
    const response = allBookMarkNests.map(util.constructBookMarkNestResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists,
    bookmarknestValidator.isValidBookMarkNestViewer,

  ],
  async (req: Request, res: Response) => {
    const authorBookMarkNests = await BookMarkNestCollection.findAllByUsername(req.query.author as string);
    const response = authorBookMarkNests.map(util.constructBookMarkNestResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new bookmarknest.
 *
 * @name POST /api/bookmarknests
 *
 * @param {string} nestname - The name of the BookMarkNest that the user is creating.
 * @return {BookMarkNestResponse} - The created bookmark
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user had already a nest with the same nestname.
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    bookmarknestValidator.isValidNestname,
    bookmarknestValidator.isNestnameNotAlreadyInUse,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const bookmarknest = await BookMarkNestCollection.addOne(userId, req.body.nestname);
    res.status(201).json({
      message: 'Your bookmarknest was created successfully.',
      bookmarknest: util.constructBookMarkNestResponse(bookmarknest)
    });
  }
);

/**
 * Delete a bookmarknest
 *
 * @name DELETE /api/bookmarknests/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the bookmarknest
 * @throws {404} - If the bookmarknestId is not valid
 */
router.delete(
  '/:bookmarknestId?',
  [
    userValidator.isUserLoggedIn,
    bookmarknestValidator.isBookMarkNestExists,
    bookmarknestValidator.isValidBookMarkNestModifier,
    bookmarknestValidator.isBookMarkNestTheRoot,
  ],
  async (req: Request, res: Response) => {
    await BookMarkNestCollection.deleteOne(req.params.bookmarknestId);
    res.status(200).json({
      message: 'Your bookmarknest was deleted successfully.'
    });
  }
);


export {router as bookmarknestRouter};
