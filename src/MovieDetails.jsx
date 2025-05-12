import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Col } from "react-bootstrap";

export default function MovieDetails() {
  const [data, setData] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://api.tvmaze.com/shows/${id}`);
        // console.log("res", res.data);
        setData(res.data);
      } catch (error) {
        console.error("API call failed:", error);
      }
    };
    fetchData();
  }, [id]);

  const cleanText = data ? (
    data.summary.replace(/<[^>]*>/g, "")
  ) : (
    <p>Loading</p>
  );

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div key={data.id} className="movie-details mt-3">
        <h1>{data.name}</h1>
        <img
          src={data.image.original}
          alt="image"
          className="movie-details-img"
        />
        <p>
          <strong>Rating: </strong>
          <span>{data.rating.average}</span>
        </p>
        <p>
          <strong>Year: </strong>
          <span>{data.ended}</span>
        </p>
        <p>
          <strong>Official site: </strong>
          <span>{data.officialSite}</span>
        </p>
        <p>
          <strong>Description: </strong>
          <span>{cleanText}</span>
        </p>
        <p>
          <strong>URL: </strong>
          <span>{data.url}</span>
        </p>
        <p>
          <strong>Country: </strong>
          <span>{data.network.country.code}</span>
        </p>
        <p>
          <strong>Country Name: </strong>
          <span>{data.network.country.name}</span>
        </p>
        <p>
          <strong>Country Code: </strong>
          <span>{data.network.country.code}</span>
        </p>
      </div>
    </>
  );
}
