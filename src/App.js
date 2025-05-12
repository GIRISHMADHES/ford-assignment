import logo from "./logo.svg";
import "./App.css";
import Dashboard from "./Dashboard";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import MovieDetails from "./MovieDetails";
import Favorites from "./Favourites";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;
