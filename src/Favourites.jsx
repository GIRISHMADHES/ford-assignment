import React, { useEffect, useState } from "react";
import { Card, Col, Row, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleToggleFavorite = (item) => {
    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.filter((fav) => fav.id !== item.id);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      return updatedFavorites;
    });
  };

  return (
    <Container>
      <h1>Favorites List</h1>
      <Row>
        {favorites.length === 0 ? (
          <p>No favorites added yet.</p>
        ) : (
          favorites.map((item) => (
            <Col key={item.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
              <Card
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
                    variant="danger"
                    onClick={(e) =>{
                        e.stopPropagation()
                        handleToggleFavorite(item)
                    } }
                  >
                    Remove from Favorites
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
