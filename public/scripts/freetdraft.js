/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewAllFreetDrafts(fields) {
    fetch('/api/freetdrafts')
      .then(showResponse)
      .catch(showResponse);
  }
  
  function viewFreetDraftsByAuthor(fields) {
    fetch(`/api/freetdrafts?author=${fields.author}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function createFreetDraft(fields) {
    fetch('/api/freetdrafts', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function editFreetDraft(fields) {
    fetch(`/api/freetdrafts/${fields.id}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function deleteFreetDraft(fields) {
    fetch(`/api/freetdrafts/${fields.id}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  