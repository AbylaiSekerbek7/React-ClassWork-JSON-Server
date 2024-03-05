import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const App = () => {
  const [books, setBooks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [newBook, setNewBook] = useState(
    {
      id: uuidv4(),
      title: "",
      author: ""
    }
  );

  useEffect(() => {
    axios.get("http://localhost:3001/books").then((res) => setBooks(res.data));
    axios.get("http://localhost:3001/favorites").then((res) => setFavorites(res.data));
  }, []);

  const onSubmit = async () => {
    await axios.post("http://localhost:3001/books", newBook).then((res) => {
     setNewBook({id: uuidv4(), title: "", author: ""});
     setBooks([...books, res.data]);
    });
  }

  const removeBook = async (id) => {
    await axios.delete(`http://localhost:3001/books/${id}`).then(() => {
      const updatedBooks = books.filter(book => book.id !== id);
      setBooks(updatedBooks);
    });
    await axios.delete(`http://localhost:3001/favorites/${id}`).then(() => {
      const updatedFav = favorites.filter(favorite => favorite.id !== id);
      setFavorites(updatedFav);
    });
  }

  const onFavorite = async (book) => {
    if (favorites.find((favorite) => favorite.id == book.id)) {
      await axios.delete(`http://localhost:3001/favorites/${book.id}`).then(() => {
      const updatedFav = favorites.filter(favorite => favorite.id !== book.id);
      setFavorites(updatedFav);
      });
    }
    else {
      await axios.post("http://localhost:3001/favorites", book).then((res) => {
      setFavorites([...favorites, res.data]);
      });
    }
    console.log(favorites);
  }

  const isFavorite = (id) => favorites.find((favorite) => favorite.id == id) ? true : false;
  

  return (
    <div>
        <h1>Library</h1>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <input onChange={(e) => setNewBook({...newBook, title: e.target.value})} type="text" placeholder='Enter title'/>
          <input onChange={(e) => setNewBook({...newBook, author: e.target.value})} type="text" placeholder='Enter author'/>
          <button type='submit'>Add</button>
        </form>
        <ul>
          {books.map((book) => (
            <>
              <h3 style={{color: isFavorite(book.id) ? "blue" : "red"}} key={book.id}>{book.title} by {book.author}</h3>
              <button onClick={() => onFavorite(book)}>Add to Favorites</button>
              <button onClick={() => removeBook(book.id)}>Delete</button>
            </>
          ))}
        </ul>
    </div>
  )
}

export default App