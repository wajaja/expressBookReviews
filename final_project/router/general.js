const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
   const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: 'Invalid username or password' })
  }
  if (users.includes(username)) {
    return res.status(400).json({ message: 'User already exists' })
  } else {
    users.push({ username, password })
    return res.status(200).json({ message: 'Customer successfully registered' })
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
   
    const getBooks = new Promise((resolve, reject) => {
       resolve(books)
   });
    getBooks.then((data) => {
      return res.status(200).json({ data })
    })
    .catch((error) => {
      return res.status(400).json({ message: error })
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  new Promise((resolve, reject) => {
    const isbn = req.params.isbn
    const book = books[isbn]
    if (!book) {
      reject('Book not found')
    } else {
      resolve(book)
    }
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(404).json({ message: error })
    })
    
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  new Promise((resolve, reject) => {
    const author = req.params.author
    const booksByAuthor = Object.values(books).filter(
      (b) => b.author === author
    )
    if (booksByAuthor.length === 0) {
      reject('No books found for this author')
    } else {
      resolve({ booksbyauthor: booksByAuthor })
    }
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(404).json({ message: error })
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  new Promise((resolve, reject) => {
    const title = req.params.title
    const booksByTitle = Object.values(books).filter((b) =>
      b.title.includes(title)
    )
    if (booksByTitle.length === 0) {
      reject('No books found with this title')
    } else {
      resolve({ booksbytitle: booksByTitle })
    }
  })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((error) => {
      res.status(404).json({ message: error })
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
   const isbn = req.params.isbn
  const book = books[isbn]
  if (!book || !book.reviews) {
    return res.status(404).json({ message: 'Reviews not found for this book' })
  }
  return res.status(200).json(book.reviews)
});

module.exports.general = public_users;
