/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewAllBookMarks(fields) {
    fetch('/api/bookmarks')
      .then(showResponse)
      .catch(showResponse);
  }
  
    
  function viewBookMarksByAuthor(fields) {
    fetch(`/api/bookmarks?author=${fields.author}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function createBookMark(fields) {
    fetch(`/api/bookmarks`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  
  function deleteBookMark(fields) {
    fetch(`/api/bookmarks/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  