import React, { useState, useEffect } from "react";
import { Card, CardMedia, CardContent, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import MovieInfoModal from "../MovieInfo/MovieInfo";

const GET_MOVIE_URL = "http://localhost:8800/api/movies/find/";

const MovieCard = ({ movieId, flag }) => {
  const [movie, setMovie] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);

  const useStyles = makeStyles((theme) => ({
    card: {
      maxWidth: 345,
      height: 500,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "black",
      color: "white",
      marginTop: flag ? "0px" : "100px",
      cursor: "pointer",
    },
    media: {
      height: 400,
      backgroundSize: "contain",
    },
    title: {
      fontWeight: 700,
      textAlign: "center",
    },
  }));

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axios.get(`${GET_MOVIE_URL}${movieId}`, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("auth")).token,
          },
        });
        setMovie(res?.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMovie();
  }, [movieId]);

  const classes = useStyles();

  return (
    <>
      {" "}
      <MovieInfoModal
        key={movie._id}
        movie={movie}
        open={showInfoModal}
        onClose={setShowInfoModal}
      />
      <Card className={classes.card} onClick={() => setShowInfoModal(true)}>
        <CardMedia
          className={classes.media}
          image={movie?.imgSm}
          title={movie?.title}
        />
        <CardContent>
          <Typography variant="h5" component="h2" className={classes.title}>
            {movie?.title}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default MovieCard;
