/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewAllBookMarkNests(fields) {
    fetch('/api/bookmarknests')
      .then(showResponse)
      .catch(showResponse);
  }
  
    
  function viewBookMarkNestsByAuthor(fields) {
    fetch(`/api/bookmarknests?author=${fields.author}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function createBookMarkNest(fields) {
    console.log("before calling fetch in nest,js")
    fetch(`/api/bookmarknests`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  
  function deleteBookMarkNest(fields) {
    fetch(`/api/bookmarknests/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  