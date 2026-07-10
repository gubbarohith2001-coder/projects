// Book class : Represents a Book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}
// UI Class : Handle UI Tasks
class UI {
  static displayBooks() {
    const books = Store.getBooks();

    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");

    const row = document.createElement("tr");
    row.className = `bg-white`
    row.innerHTML = `
    <td class="py-4 px-3">${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td>
    <a href = "#" class= "bg-red-500 text-white p-2 px-3 rounded-lg  delete">X</a>
    </td>
    <td>
    <a href = "#" class= "bg-gray-500 text-white p-2 rounded-lg  update">
    <i class="fa-regular fa-pen-to-square"></i>
    </a>
    </td>
    `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert p-4 mb-4 text-sm text-${className}-800 rounded-lg bg-${className}-50 border border-${className}-200 `;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);
    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static editBook(el) {
    const row = el.closest("tr");

    // Get the current values from the table row
    const title = row.cells[0].innerText;
    const author = row.cells[1].innerText;
    const isbn = row.cells[2].innerText;

    // Fill the inputs
    document.querySelector("#title").value = title;
    document.querySelector("#author").value = author;
    document.querySelector("#isbn").value = isbn;

    document.querySelector("#isbn").readOnly = true;

    const submitBtn = document.querySelector('input[type = "submit"]');
    submitBtn.value = "Update Book";
  }
  static resetForm() {
    this.clearFields();
    document.querySelector("#isbn").readOnly = false;
    const submitBtn = document.querySelector('input[type = "submit"]');
    submitBtn.value = "Add Book";
  }
  static searchBooks(e) {
    // input to search
    const searchedTerm = e.target.value.toLowerCase();

    // Get the books from the storage
    const books = Store.getBooks();

    // filter method to find matches
    const filteredBooks = books.filter((book) => {
      return (
        book.title.toLowerCase().includes(searchedTerm) ||
        book.author.toLowerCase().includes(searchedTerm) ||
        book.isbn.includes(searchedTerm)
      );
    });

    // Clear the current UI
    document.getElementById("book-list").innerHTML = "";

    //Re-display the only filtered books
    filteredBooks.forEach((book) => UI.addBookToList(book));
  }
}
// Store Class : Handles storage

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }

  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }

  static removeBook(isbn) {
    const books = Store.getBooks();

    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }

  static updateBook(updatedBook) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === updatedBook.isbn) {
        books[index] = updatedBook;
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event : Display Books
document.addEventListener("DOMContentLoaded", UI.displayBooks);
// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  //  prevent actual submit
  e.preventDefault();

  // get form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;
  const submitBtnValue = document.querySelector('input[type="submit"]').value;

  //   validate form
  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("please fill all fields", "red");
  } else {
    // intatiate book
    const book = new Book(title, author, isbn);
    if (submitBtnValue === "Add Book") {
      // Add Book to UI
      UI.addBookToList(book);

      // Add Book to store
      Store.addBook(book);

      // Success message
      UI.showAlert("Book Added", "green");
      UI.clearFields();
    } else {
      // Edit Mode
      Store.updateBook(book);
      document.querySelector("#book-list").innerHTML = "";
      UI.displayBooks();
      UI.showAlert("Book is Updated", "blue");
      UI.resetForm();
    }
  }
});
// Event: Remove a Book
document.querySelector("#book-list").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    UI.deleteBook(e.target);

    // Remove from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    // Removed message
    UI.showAlert("Book Removed", "green");
  }

  //Edit a book
  const editBtn = e.target.closest(".update");
  if (editBtn) {
    UI.editBook(editBtn);
  }

});

// Event : Search / Filter books

document.querySelector(".search").addEventListener("input", (e) => {
  UI.searchBooks(e);
});
