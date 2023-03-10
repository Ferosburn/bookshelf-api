const { nanoid } = require('nanoid');
const books = require('./books');

const insertBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  let errorMessage;
  if (newBook.name === undefined) {
    errorMessage = 'Mohon isi nama buku';
  } else if (newBook.readPage > newBook.pageCount) {
    errorMessage = 'readPage tidak boleh lebih besar dari pageCount';
  } else {
    books.push(newBook);
  }

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: `Gagal menambahkan buku. ${errorMessage}`,
    })
    .code(400);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks;

  if (name !== undefined) {
    filteredBooks = books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  } else if (reading === '0') {
    filteredBooks = books.filter((book) => book.reading === false);
  } else if (reading === '1') {
    filteredBooks = books.filter((book) => book.reading === true);
  } else if (finished === '0') {
    filteredBooks = books.filter((book) => book.finished === false);
  } else if (finished === '1') {
    filteredBooks = books.filter((book) => book.finished === true);
  } else {
    filteredBooks = books;
  }

  const response = h.response({
    status: 'success',
    data: {
      books: filteredBooks.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });
  response.code(200);
  return response;
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book !== undefined) {
    const response = h
      .response({
        status: 'success',
        data: { book },
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    })
    .code(404);
  return response;
};

const editBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const updatedAt = new Date().toISOString();
  const finished = readPage === pageCount;

  const index = books.findIndex((book) => book.id === bookId);

  let errorMessage;
  if (index === -1) {
    errorMessage = 'Id tidak ditemukan';
  } else if (name === undefined) {
    errorMessage = 'Mohon isi nama buku';
  } else if (readPage > pageCount) {
    errorMessage = 'readPage tidak boleh lebih besar dari pageCount';
  }

  if (errorMessage === undefined) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
      })
      .code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: `Gagal memperbarui buku. ${errorMessage}`,
  });
  if (index === -1) {
    response.code(404);
  } else {
    response.code(400);
  }
  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      })
      .code(200);
    return response;
  }

  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    })
    .code(404);
  return response;
};

module.exports = {
  insertBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookByIdHandler,
  deleteBookByIdHandler,
};
