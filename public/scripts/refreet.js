/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewAllReFreets(fields) {
    fetch('/api/refreets')
      .then(showResponse)
      .catch(showResponse);
  }
  
    
  // function viewReFreetsByAuthor(fields) {
  //   fetch(`/api/refreets?author=${fields.author}`)
  //     .then(showResponse)
  //     .catch(showResponse);
  // }
  
  // function viewReFreetsOnFreet(fields) {
  //   fetch(`/api/refreets/${fields.freet}`) // THIS HAS BEEN TURNED INTO A PARAMETER TO SOLVE PRIOR BUGS
  //   // fetch(`/api/refreets`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
  //   .then(showResponse)
  //     .catch(showResponse);
  // }
  // BUGGY CODE - OBSOLETE
  function viewReFreetsByQuery(fields) {
    // fetch(`/api/refreets?author=${fields.author}&freet=${fields.freet}`)
    //   .then(showResponse)
    //   .catch(showResponse);
    if (fields.author){
    fetch(`/api/refreets?author=${fields.author}`)
      .then(showResponse)
      .catch(showResponse);
    }
    else{
      fetch(`/api/refreets?freet=${fields.freet}`)
      .then(showResponse)
      .catch(showResponse);
    }
  
  }
  function createReFreet(fields) {
    fetch(`/api/refreets`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  
  function deleteReFreet(fields) {
    fetch(`/api/refreets/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  