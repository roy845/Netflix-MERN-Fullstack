import React, { useEffect, useContext, useState } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import Navbar from "../navbar/Navbar";
import { UserContext } from "../../context/userContext/UserContext";
import { useAuth } from "../../context/authContext/AuthContext";
import AddContentToMyList from "../AddContentToMyList/AddContentToMyList";
import LoadingSpinner from "../spinner/Spinner";
import { ListContext } from "../../context/listContext/ListContext";
// import NoMoviesToDisplay from "../NoMoviesToDisplay/NoMoviesToDisplay";
import SeriesCardMyList from "../SeriesCardMyList/SeriesCardMyList";
import MovieCardMyList from "../MovieCardMyList/MovieCardMyList";

const GET_MY_SERIES_LIST_URL =
  "http://localhost:8800/api/users/getMySeriesList/";
const GET_MY_MOVIE_LIST_URL =
  "http://localhost:8800/api/users/getMyMoviesList/";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "black",
    padding: theme.spacing(2),
    width: "100%",
    height: "100%",
  },

  search: {
    backgroundColor: "#000000",
    marginTop: "80px",
    marginBottom: "10px",
    width: "100%",

    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "white",
        borderWidth: 1,
      },
      "&:hover fieldset": {
        borderColor: "white",
      },
    },
  },

  inputRoot: {
    color: "white",
  },
  input: {
    "&::placeholder": {
      color: "white",
      opacity: 1,
    },
  },
  labelRoot: {
    color: "white",
  },
  darkBackground: {
    backgroundColor: theme.palette.background.paper,
  },
  inputRoot: {
    color: "white", // Set the color of the text to white
  },
  input: {
    "&::placeholder": {
      color: "white", // Set the color of the placeholder to white
      opacity: 1, // Make the placeholder fully opaque
    },
  },
  labelRoot: {
    color: "white", // Set the color of the label to white
  },
}));

const MyList = () => {
  const classes = useStyles();
  const {
    myMovieListInfo,
    setMyMovieListInfo,
    mySeriesListInfo,
    setMySeriesListInfo,
  } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const { lists } = useContext(ListContext);
  const { auth, setAuth } = useAuth();
  useEffect(() => {
    const getMyMovieList = async () => {
      try {
        const { data } = await axios.get(
          `${GET_MY_MOVIE_LIST_URL}${auth?.user?._id}`
        );

        setMyMovieListInfo((prevState) => ({
          ...prevState,
          content: data.content,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    getMyMovieList();
  }, []);

  useEffect(() => {
    const getMySeriesList = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${GET_MY_SERIES_LIST_URL}${auth?.user?._id}`
        );
        setIsLoading(false);
        setMySeriesListInfo((prevState) => ({
          ...prevState,
          content: data.content,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    getMySeriesList();
  }, []);

  const myMovieContent = myMovieListInfo?.content.map((movieId) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={movieId}>
        <MovieCardMyList flag={false} key={movieId} movieId={movieId} />
      </Grid>
    );
  });

  const mySeriesContent = mySeriesListInfo?.content.map((seriesId) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={seriesId}>
        <SeriesCardMyList flag={false} key={seriesId} seriesId={seriesId} />
      </Grid>
    );
  });

  return (
    <div className={classes.root}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Navbar />

          <Grid container spacing={3}>
            {myMovieContent}
            {mySeriesContent}
          </Grid>
          {myMovieListInfo?.content.length === 0 &&
            mySeriesListInfo?.content.length === 0 && <AddContentToMyList />}
        </>
      )}
    </div>
  );
};

export default MyList;
