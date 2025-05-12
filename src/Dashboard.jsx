import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row, Container, Button, Dropdown } from "react-bootstrap";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 20;
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState("asc");
  const [year, setYear] = useState("");
  const [ratingSortOrder, setRatingSortOrder] = useState("high");
  const [favorites, setFavorites] = useState([]);
  const [deSearch, setDeSearch] = useState('')


  const debounceSearch = useCallback((
    debounce((val)=>{
      setDeSearch(val)
    }, 500)
  ),[])

  const handleChangeInput = (e) =>{
    const val = e.target.value
    setSearch(val)
    debounceSearch(val)
  }
  const filteredData = data
    .filter((item) => item.name.toLowerCase().includes(deSearch.toLowerCase()))
    .filter((item) => (year ? item.ended && item.ended.includes(year) : true))
    .sort((a, b) => {
      if (sortOrder) {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (ratingSortOrder) {
        const aRating = a.rating?.average || 0;
        const bRating = b.rating?.average || 0;
        return ratingSortOrder === "high"
          ? bRating - aRating
          : aRating - bRating;
      }
      return 0;
    });

  const handleToggleFavorite = (item) => {
    setFavorites((prevFavorites) => {
      let updatedFavorites;
      if (prevFavorites.some((fav) => fav.id === item.id)) {
        updatedFavorites = prevFavorites.filter((fav) => fav.id !== item.id);
      } else {
        updatedFavorites = [...prevFavorites, item];
      }
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://api.tvmaze.com/shows");
        console.log("res", res.data);
        setData(res.data);
      } catch (error) {
        console.error("API call failed:", error);
      }
    };
    fetchData();
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const favoritesClick = () => {
    navigate("/favorites");
  };

  return (
    <>
      <Container>
        <Card className="mt-3">
          <Card.Body className="d-flex ms-3">
            <input
              placeholder="Search movie title"
              value={search}
              type="text"
              onChange={handleChangeInput}
              className="me-3"
            />
            <Dropdown className="me-3">
              <Dropdown.Toggle variant="secondary" id="sort-dropdown">
                Sort by Title
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setSortOrder("asc");
                    setRatingSortOrder("");
                  }}
                >
                  A–Z
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setSortOrder("desc");
                    setRatingSortOrder("");
                  }}
                >
                  Z–A
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <input
              placeholder="Search Year"
              value={year}
              type="text"
              onChange={(e) => setYear(e.target.value)}
              className="me-3"
            />
            <Dropdown className="me-3">
              <Dropdown.Toggle variant="secondary" id="rating-sort-dropdown">
                Sort by Rating
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() => {
                    setRatingSortOrder("high");
                    setSortOrder("");
                  }}
                >
                  High to Low
                </Dropdown.Item>
                <Dropdown.Item
                  onClick={() => {
                    setRatingSortOrder("low");
                    setSortOrder("");
                  }}
                >
                  Low to High
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Button onClick={favoritesClick}>Favourites</Button>
          </Card.Body>
        </Card>
        <Row>
          <h1>Movie List</h1>
          {currentRows.map((item) => (
            <Col xs={12} sm={6} md={4} lg={3} key={item.id} className="mb-4">
              <Card
                key={item.id}
                className="movies-card h-100"
                onClick={() => navigate(`/movies/${item.id}`)}
              >
                <Card.Body>
                  <Card.Title>{item.name}</Card.Title>
                  <img
                    src={item.image.original}
                    alt="image"
                    className="img-fluid movie-poster"
                  />
                  <p>
                    <strong>Rating: </strong>
                    <span>{item.rating.average}</span>
                  </p>
                  <p>
                    <strong>Year: </strong>
                    <span>{item.ended}</span>
                  </p>
                  <Button
                    variant={
                      favorites.some((fav) => fav.id === item.id)
                        ? "danger"
                        : "outline-danger"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(item);
                    }}
                  >
                    {favorites.some((fav) => fav.id === item.id)
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="pagination-info">
          <Button
            className="table-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            {/* <FaChevronLeft /> */}
            <span>&lt;</span>
          </Button>

          <span>
            {currentPage} of {totalPages}
          </span>

          <Button
            className="table-button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            {/* <FaChevronRight /> */}
            <span>&gt;</span>
          </Button>
        </div>
      </Container>
    </>
  );
}
