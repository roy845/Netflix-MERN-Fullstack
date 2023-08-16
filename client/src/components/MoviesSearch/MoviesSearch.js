import React, { useState, useEffect } from "react";
import "./moviesSearch.scss";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  TextField,
} from "@material-ui/core";
import axios from "axios";
import Navbar from "../navbar/Navbar";
import MovieInfoModal from "../MovieInfo/MovieInfo";
import { Search } from "@material-ui/icons";
import { InputAdornment } from "@material-ui/core";
import SeriesInfoModal from "../SeriesInfo/SeriesInfo";
import LoadingSpinner from "../spinner/Spinner";
import SeriesCardMyList from "../SeriesCardMyList/SeriesCardMyList";
import MovieCardMyList from "../MovieCardMyList/MovieCardMyList";
import { useAuth } from "../../context/authContext/AuthContext";

const GET_ALL_MOVIES_URL = "http://localhost:8800/api/movies";
const GET_ALL_SERIES_URL = "http://localhost:8800/api/movies/series";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "black",
    padding: theme.spacing(2),
    width: "100%",
    height: "100%",
  },
  card: {
    maxWidth: 345,
    height: 500,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "black",
    color: "white",

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

  search: {
    backgroundColor: "#000000",
    marginTop: "20px",
    marginBottom: "50px",
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

const MoviesSearch = () => {
  const classes = useStyles();
  const [searchTermMovies, setSearchTermMovies] = useState("");
  const [searchTermSeries, setSearchTermSeries] = useState("");
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSearch, setSelectedSearch] = useState("Movies");
  const { auth, setAuth } = useAuth();

  const options = ["Movies", "Series"];

  useEffect(() => {
    const GetAllMovies = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(GET_ALL_MOVIES_URL, {
          headers: {
            Authorization: auth?.token,
          },
        });
        setIsLoading(false);
        setMovies(data);
      } catch (error) {
        console.log(error);
      }
    };

    GetAllMovies();
  }, []);

  useEffect(() => {
    const GetAllSeries = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(GET_ALL_SERIES_URL, {
          headers: {
            Authorization: auth?.token,
          },
        });
        setIsLoading(false);
        setSeries(data);
      } catch (error) {
        console.log(error);
      }
    };

    GetAllSeries();
  }, []);

  const filterMovies = movies.filter((c) => {
    return searchTermMovies.toLowerCase() !== ""
      ? c.title.toLowerCase().includes(searchTermMovies.toLowerCase())
      : c;
  });

  const filterSeries = series.filter((c) => {
    return searchTermSeries.toLowerCase() !== ""
      ? c.title.toLowerCase().includes(searchTermSeries.toLowerCase())
      : c;
  });

  const movieContent = filterMovies?.map((movie) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={movie._id}>
        <MovieCardMyList flag key={movie._id} movieId={movie._id} />
      </Grid>
    );
  });

  const seriesContent = filterSeries?.map((series) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} key={series._id}>
        <SeriesCardMyList flag key={series._id} seriesId={series._id} />
      </Grid>
    );
  });

  const handleSearchMoviesChange = (event) => {
    setSearchTermMovies(event.target.value);
  };

  const handleSearchSeriesChange = (event) => {
    setSearchTermSeries(event.target.value);
  };

  const handleSearchSelect = (event) => {
    setSelectedSearch(event.target.value);
  };

  const searchOptions = options.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ));

  return (
    <div className={classes.root}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Navbar />
          <div className="select-container">
            <select
              style={{ border: "1px solid white" }}
              value={selectedSearch}
              onChange={handleSearchSelect}
            >
              {searchOptions}
            </select>
          </div>

          {selectedSearch === "Movies" ? (
            <>
              {" "}
              <TextField
                variant="outlined"
                className={classes.search}
                value={searchTermMovies}
                onChange={handleSearchMoviesChange}
                InputProps={{
                  style: { color: "white" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  placeholder: "Search Movies",
                  classes: { root: classes.inputRoot, input: classes.input },
                }}
                InputLabelProps={{
                  style: { color: "white" },
                  shrink: true,
                  classes: { root: classes.labelRoot },
                }}
              />
              <Grid container spacing={3}>
                {movieContent}
              </Grid>
            </>
          ) : (
            <>
              {" "}
              <TextField
                variant="outlined"
                className={classes.search}
                value={searchTermSeries}
                onChange={handleSearchSeriesChange}
                InputProps={{
                  style: { color: "white" },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  placeholder: "Search Series",
                  classes: { root: classes.inputRoot, input: classes.input },
                }}
                InputLabelProps={{
                  style: { color: "white" },
                  shrink: true,
                  classes: { root: classes.labelRoot },
                }}
              />
              <Grid container spacing={3}>
                {seriesContent}
              </Grid>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MoviesSearch;
