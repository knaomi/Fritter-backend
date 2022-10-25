/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewAllLikes(fields) {
    fetch('/api/likes')
      .then(showResponse)
      .catch(showResponse);
  }
  
    
  // function viewLikesByAuthor(fields) {
  //   fetch(`/api/likes?author=${fields.author}`)
  //     .then(showResponse)
  //     .catch(showResponse);
  // }

  // function viewLikesOnFreet(fields) {
  //   fetch(`/api/likes/${fields.freet}`)
  //     .then(showResponse)
  //     .catch(showResponse);
  // }
  // BUGGY CODE - OBSOLETE
  function viewLikesByQuery(fields) {
  //   fetch(`/api/likes?author=${fields.author}&freet=${fields.freet}`)
  //     .then(showResponse)
  //     .catch(showResponse);
  // }
    if (fields.author !== undefined){
      fetch(`/api/likes?author=${fields.author}`)
      .then(showResponse)
      .catch(showResponse);
    }
    else{
      fetch(`/api/likes?freet=${fields.freet}`)
      .then(showResponse)
      .catch(showResponse);
    }
  }
  
  function createLike(fields) {
    fetch(`/api/likes`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  
  function deleteLike(fields) {
    fetch(`/api/likes/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  