$(document).ready(function(){
  console.log('jQuery sourced.');
  refreshBooks();
  addClickHandlers();
});

function addClickHandlers() {
  $('#submitBtn').on('click', handleSubmit);
  $(document).on('click', '.deleteButton', onDeleteBook)
  $(document).on('click', '.isReadButton', onReadButton)
  // TODO - Add code for edit & delete buttons
  
}

function onReadButton() {
  let bookId = $(this).parents('tr').data('id');
  let isRead = $(this).parents('tr').data('isRead');
  $.ajax({
    method: 'PUT',
    url: `/books/${bookId}`,
    //pass updated version to server 
    //ie transfer a representation of state
    data: {
      isRead: isRead = true
    }
  })
    .then(() => {
      console.log('put success');
      refreshBooks();
    })
    .catch((err) => {
      console.log('put failed', err);

    })
}
function onDeleteBook() {
  let bookId = $(this).parents('tr').data('id');
  console.log('onDeleteBook', bookId); 
  $.ajax({
    method: 'DELETE',
    // id goes into url (standard convention)
    url: `/books/${bookId}`
  })
  .then(() => {
    console.log('delete success!');
    
    refreshBooks()
  })
  .catch((err) => {
    console.log('delete failed');
    
  })
}

function handleSubmit() {
  console.log('Submit button clicked.');
  let book = {};
  book.author = $('#author').val();
  book.title = $('#title').val();
  addBook(book);
}

// adds a book to the database
function addBook(bookToAdd) {
  $.ajax({
    type: 'POST',
    url: '/books',
    data: bookToAdd,
    }).then(function(response) {
      console.log('Response from server.', response);
      refreshBooks();
    }).catch(function(error) {
      console.log('Error in POST', error)
      alert('Unable to add book at this time. Please try again later.');
    });
}

// refreshBooks will get all books from the server and render to page
function refreshBooks() {
  $.ajax({
    type: 'GET',
    url: '/books'
  }).then(function(response) {
    console.log(response);
    renderBooks(response);
  }).catch(function(error){
    console.log('error in GET', error);
  });
}


// Displays an array of books to the DOM
function renderBooks(books) {
  $('#bookShelf').empty();

  for(let i = 0; i < books.length; i += 1) {
    let book = books[i];
    // For each book, append a new row to our table
    $('#bookShelf').append(`
      <tr data-id = "${books[i].id}" tr data-id = "${book.isRead}">
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isRead}</td>
        <td><button class="deleteButton">delete</button></td>
        <td><button class="isReadButton">Mark as read</button></td>
      </tr>
    `);
  }
}
