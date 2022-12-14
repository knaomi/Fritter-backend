// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'create-freet': createFreet,
  'create-freet-with-expiringtime': createExpiringFreet,
  // 'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'view-all-freetdrafts': viewAllFreetDrafts,
  // 'view-freetdrafts-by-author': viewFreetDraftsByAuthor,
  'create-freetdraft': createFreetDraft,
  'edit-freetdraft': editFreetDraft,
  'delete-freetdraft': deleteFreetDraft,
  'view-all-bookmarks': viewAllBookMarks,
  // 'view-bookmarks-by-author': viewBookMarksByAuthor,
  'create-bookmark-in-existing-nest': createBookMark,
  'create-bookmark-in-new-nest': createBookMarkNewNest,
  'delete-bookmark': deleteBookMark,
  'view-all-bookmarknests': viewAllBookMarkNests,
  // 'view-bookmarknests-by-author': viewBookMarkNestsByAuthor, OLD AND OBSOLETE DUE TO PRIVACY
  'create-bookmarknest': createBookMarkNest,
  'delete-bookmarknest': deleteBookMarkNest,
  'view-all-downfreets': viewAllDownFreets,
  // 'view-downfreets-by-author': viewDownFreetsByAuthor,
  // 'view-downfreets-on-freet': viewDownfreetsOnFreet, 
  'view-downfreets-by-author': viewDownFreetsByQuery,
  'view-downfreets-on-freet': viewDownFreetsByQuery,
  'create-downfreet': createDownFreet,
  'delete-downfreet': deleteDownFreet,
  'view-all-refreets': viewAllReFreets,
  // 'view-refreets-by-author': viewReFreetsByAuthor, 
  // 'view-refreets-on-freet': viewRefreetsOnFreet,
  'view-refreets-by-author': viewReFreetsByQuery, // WRONG = OBSOLETE = BUGGY
  'view-refreets-on-freet': viewReFreetsByQuery,
  'create-refreet': createReFreet,
  'delete-refreet': deleteReFreet,
  'view-all-likes': viewAllLikes,
  // 'view-likes-by-author': viewLikesByAuthor, 
  // 'view-likes-on-freet': viewLikesOnFreet, 
  'view-likes-by-author': viewLikesByQuery, 
  'view-likes-on-freet': viewLikesByQuery,
  'create-like': createLike,
  'delete-like': deleteLike,

};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
