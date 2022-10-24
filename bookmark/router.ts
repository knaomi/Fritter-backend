import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import BookMarkCollection from './collection';
import * as userValidator from '../user/middleware';
import * as bookmarkValidator from './middleware';
import * as bookmarknestValidator from '../bookmarknest/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import UserCollection from '../user/collection';
import BookMarkNestCollection from '../bookmarknest/collection';

const router = express.Router();

/**
 * Get all the bookmarks (by user)
 *
 * @name GET /api/bookmarks
 *
 * @return {BookMarkResponse[]} - A list of all the bookmarks sorted in descending
 *                      order by date added
 * * @throws {403} - If user is not logged in
 */

//  */
// /**
//  * Get bookmarks by author.
//  *
//  * @name GET /api/bookmarks?authorId=id
//  *
//  * @return {BookMarkResponse[]} - An array of bookmarks created by user with id, authorId
//  * @throws {400} - If authorId is not given
//  * @throws {404} - If no user has given authorId
 

router.get(
  '/',
  // async (req: Request, res: Response, next: NextFunction) => {
  //   // Check if authorId query parameter was supplied
  //   if (req.query.author !== undefined) {
  //     next();
  //     return;
  //   }
  //   const allBookMarks = await BookMarkCollection.findAll();
  //   const response = allBookMarks.map(util.constructBookMarkResponse);
  //   res.status(200).json(response);
  // },
  [
    userValidator.isUserLoggedIn,
    // userValidator.isAuthorExists,
    // bookmarkValidator.isValidBookMarkViewer,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const authorBookMarks = await BookMarkCollection.findAllByUserId(userId);
    const response = authorBookMarks.map(util.constructBookMarkResponse);
    res.status(200).json(response);
  }
);


/**
 * Create a new bookmark (in an already existing nest).
 *
//  * @name POST /api/bookmarknests/{:bookmarknestId}/bookmarks
 * @name POST /api/bookmarks
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
    // bookmarknestValidator.isBookMarkNestExists,
    bookmarkValidator.isValidBookMarkNestId,
  ],
  async (req: Request, res: Response) => {
    console.log("got to posting in router", req.body.bookmarknestid, req)
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const bookmark = await BookMarkCollection.addOne(userId, req.body.bookmarknestid, req.body.freetid);

    res.status(201).json({
      message: 'Your bookmark was created successfully.',
      bookmark: util.constructBookMarkResponse(bookmark)
    });
  }
);


// /** IMPLEMENTED IN BOOKMARKNEST
//  * Create a new bookmark in a new nest
//  *
//  * @name POST /api/bookmarknests/{:nestname}/bookmarks
//  *
//  * @param {string} freetid - The freet that the user is bookMarking
//  * @return {BookMarkResponse} - The created bookmark
//  * @throws {403} - If the user is not logged in
//  * @throws {400} - If the user had already added a bookMark on the Freet
//  * @throws{404} - If the freetid does not exist.
//  */
//  router.post(
//   '/',
//   [
//     userValidator.isUserLoggedIn,
//     bookmarkValidator.isValidFreetId,
//     bookmarkValidator.isUserAlreadyBookMarking,
//     bookmarknestValidator.isValidNestname,
//   ],
//   async (req: Request, res: Response) => {
//     console.log("got to posting in router with nestname", req.body.nestname)
//     const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
//     const bookmarknest = await BookMarkNestCollection.addOne(userId, req.body.nestname);
//     const bookmark = await BookMarkCollection.addOne(userId, bookmarknest._id, req.body.freetid);

//     res.status(201).json({
//       message: 'Your bookmark was created successfully.',
//       bookmark: util.constructBookMarkResponse(bookmark)
//     });
//   }
// );

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
    await BookMarkCollection.deleteManybyExpiration();
    res.status(200).json({
      message: 'Your bookmark was deleted successfully.'
    });
  }
);


export {router as bookmarkRouter};
