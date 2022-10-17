/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

//  function viewAllDownFreets(fields) {
//     fetch('/api/downfreets')
//       .then(showResponse)
//       .catch(showResponse);
//   }
  
  function viewDownFreetsByAuthor(fields) {
    fetch(`/api/downfreets?author=${fields.author}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function createDownFreet(fields) {
    fetch(`/api/downfreets/${fields.id}`, {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }

//   function editFreet(fields) {
//     fetch(`/api/freets/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
//       .then(showResponse)
//       .catch(showResponse);
//   }
  
  function deleteDownFreet(fields) {
    fetch(`/api/downfreets/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  