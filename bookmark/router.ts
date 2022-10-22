import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BookMarkCollection from './collection';
import * as userValidator from '../user/middleware';
import * as bookmarkValidator from './middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the bookmarks
 *
 * @name GET /api/bookmarks
 *
 * @return {BookMarkResponse[]} - A list of all the bookmarks sorted in descending
 *                      order by date added
 */
/**
 * Get bookmarks by author.
 *
 * @name GET /api/bookmarks?authorId=id
 *
 * @return {BookMarkResponse[]} - An array of bookmarks created by user with id, authorId
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
    // ADD CHECK SO THAT ALL BOOKMARKS ARE ONLY THOSE OF THE USER
    const allBookMarks = await BookMarkCollection.findAll();
    const response = allBookMarks.map(util.constructBookMarkResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isAuthorExists
    // ADD CHECK SO THAT AUTHOR = REQ.SESSION.ID i.e. only a user can view their own bookmarks
    // DO THIS FOR FREET-DRAFTS AS WELL
  ],
  async (req: Request, res: Response) => {
    const authorBookMarks = await BookMarkCollection.findAllByUsername(req.query.author as string);
    const response = authorBookMarks.map(util.constructBookMarkResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new bookmark.
 *
 * @name POST /api/bookmarks
 *
 * @param {string} freetid - The freet that the user is bookMarking
 * @return {BookMarkResponse} - The created bookmark
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the user had already added a bookMark on the Freet
 * @throws{404} - If the freetid does not exist.
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isValidFreetId,
    bookmarkValidator.isUserAlreadyBookMarking,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const bookmark = await BookMarkCollection.addOne(userId, req.body.freetid);

    res.status(201).json({
      message: 'Your bookmark was created successfully.',
      bookmark: util.constructBookMarkResponse(bookmark)
    });
  }
);

/**
 * Delete a bookmark
 *
 * @name DELETE /api/bookmarks/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the bookmark
 * @throws {404} - If the bookmarkId is not valid
 */
router.delete(
  '/:bookmarkId?',
  [
    userValidator.isUserLoggedIn,
    bookmarkValidator.isBookMarkExists,
    bookmarkValidator.isValidBookMarkModifier
  ],
  async (req: Request, res: Response) => {
    await BookMarkCollection.deleteOne(req.params.bookmarkId);
    res.status(200).json({
      message: 'Your bookmark was deleted successfully.'
    });
  }
);


export {router as bookmarkRouter};
