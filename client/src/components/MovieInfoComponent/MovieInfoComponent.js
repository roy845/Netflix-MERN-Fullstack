import { useState, useEffect, useContext } from "react";
import "./movieInfoComponent.scss";
import { useParams, useNavigate } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@material-ui/core";
import {
  ThumbDownOutlined,
  ThumbUpAltOutlined,
  ThumbDownAlt,
  ThumbUpAlt,
  StarOutline,
  Star,
} from "@material-ui/icons";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { Add } from "@material-ui/icons";
import { UserContext } from "../../context/userContext/UserContext";
import axios from "axios";
import { toast } from "react-hot-toast";
import CheckIcon from "@material-ui/icons/Check";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useAuth } from "../../context/authContext/AuthContext";

const UPDATE_MOVIE_RATINGS = "http://localhost:8800/api/users/movieLikes/";
const GET_MOVIE_RATINGS = "http://localhost:8800/api/users/movieLikes/";
const ADD_TO_MY_LIST_URL = "http://localhost:8800/api/users/addToMyListMovies/";
const REMOVE_FROM_MY_LIST_URL =
  "http://localhost:8800/api/users/removeMyListMovies/";

const GET_MOVIE_URL = "http://localhost:8800/api/movies/find/";

const useStyles = makeStyles((theme) => ({
  poster: {
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
  },
  thumbnail: {
    width: "100%",
    maxWidth: "200px",
    height: "auto",
  },
  ageLimit: {
    backgroundColor: "#f44336",
    color: "#fff",
    padding: theme.spacing(0.5),
    borderRadius: theme.shape.borderRadius,
    fontWeight: 600,
    fontSize: "0.8rem",
    marginLeft: theme.spacing(1),
  },
  rating: {
    display: "flex",
    alignItems: "center",
    "& > *": {
      marginRight: theme.spacing(1),
    },
    marginBottom: "20px",
    cursor: "pointer",
  },
  dialog: {
    width: "50%",
    margin: "auto",
    alignItems: "center",
    justifyContent: "center",
    "& .MuiPaper-root": {
      backgroundColor: "#000",
      color: "#fff",
    },
  },
  closeButton: {
    position: "absolute",
    top: theme.spacing(1),
    right: theme.spacing(1),
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
    marginRight: "10px",
  },
  watchButton: {
    backgroundColor: "#e50914",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#b20710",
    },
    dialogContent: {
      overflowY: "auto",
    },
  },
}));

const MovieInfoComponent = () => {
  const { mId } = useParams();
  const [movie, setMovie] = useState({});
  const navigate = useNavigate();
  console.log(mId);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const { data } = await axios.get(`${GET_MOVIE_URL}${mId}`);
        setMovie(data);
      } catch (error) {
        console.log(error);
      }
    };

    getMovie();
  }, []);

  const classes = useStyles();
  const [hasMovieInfoChanged, setHasMovieInfoChanged] = useState(false);
  const { movieInfo, setMovieInfo, myMovieListInfo, setMyMovieListInfo } =
    useContext(UserContext);
  const [adding, setAdding] = useState(false);
  const { auth, setAuth } = useAuth();

  const movieDuration = `${Math.floor(movie?.duration / 60)} hours ${
    movie?.duration % 60
  } minutes`;

  const handleStarIconClick = (movieId, newRating) => {
    if (newRating === 1 && movieInfo[movieId]?.rating === 1) {
      const updatedMovieInfo = {
        ...movieInfo,
        [movieId]: {
          ...movieInfo[movieId],
          rating: 0,
        },
      };
      setMovieInfo(updatedMovieInfo);
      setHasMovieInfoChanged(true);
    } else {
      const updatedMovieInfo = {
        ...movieInfo,
        [movieId]: {
          ...movieInfo[movieId],
          rating: newRating,
        },
      };
      setMovieInfo(updatedMovieInfo);
      setHasMovieInfoChanged(true);
    }
  };

  const icons = Array.from({ length: 5 }, (_, index) => (
    <StarOutline
      key={index}
      onClick={() => handleStarIconClick(movie?._id, index + 1)}
    />
  ));

  const RatingStars = icons?.map((icon, index) =>
    index < movieInfo[movie?._id]?.rating ? (
      <Star
        key={index}
        onClick={() => handleStarIconClick(movie?._id, index + 1)}
      />
    ) : (
      icon
    )
  );

  const handleLike = (movieId) => {
    const updatedMovieInfo = {
      ...movieInfo,
      [movieId]: {
        ...movieInfo[movieId],
        like: !movieInfo[movieId]?.like,
        dislike: false, // use movieId here as well
      },
    };
    setMovieInfo(updatedMovieInfo);
    setHasMovieInfoChanged(true);
  };

  const handledisLike = (movieId) => {
    const updatedMovieInfo = {
      ...movieInfo,
      [movieId]: {
        ...movieInfo[movieId],
        like: false,
        dislike: !movieInfo[movieId]?.dislike, // use movieId here as well
      },
    };

    setMovieInfo(updatedMovieInfo);
    setHasMovieInfoChanged(true);
  };

  const updateMovieInfo = async (movieInfo) => {
    if (hasMovieInfoChanged) {
      try {
        const { data } = await axios.put(
          `${UPDATE_MOVIE_RATINGS}${auth?.user?._id}`,
          movieInfo
        );

        setMovieInfo(data);
      } catch (error) {
        console.log(error);
      }
      setHasMovieInfoChanged(false);
    }
  };

  const fetchUserMovieInfo = async () => {
    try {
      const { data } = await axios.get(
        `${GET_MOVIE_RATINGS}${auth?.user?._id}`
      );
      setMovieInfo(data?.movieRatings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserMovieInfo();
  }, []);

  const handleClose = () => {
    navigate(-1);
    updateMovieInfo(movieInfo);
  };

  const addToMyList = async () => {
    try {
      setAdding(true);
      const { data } = await axios.post(
        `${ADD_TO_MY_LIST_URL}${auth?.user?._id}`,
        {
          listTitle: "My Movies List",
          movieId: movie._id,
        }
      );
      setAdding(false);
      setMyMovieListInfo(data);
      toast.success(`${movie.title} added to ${data.title}`);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromMyList = async () => {
    try {
      setAdding(true);
      const { data } = await axios.delete(
        `${REMOVE_FROM_MY_LIST_URL}${auth?.user?._id}/${movie._id}`
      );
      setAdding(false);
      toast.success(`${movie?.title} removed from ${myMovieListInfo.title}`);
      setMyMovieListInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes.dialog}>
      <ArrowForwardIosIcon
        className={classes.closeButton}
        onClick={handleClose}
      />

      <DialogTitle id="movie-info-dialog-title">{movie?.title}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <video src={movie?.trailer} className={classes.poster} controls />
        <Typography variant="subtitle1" gutterBottom>
          {movieDuration} |
          <span className={classes.ageLimit}>{`${movie?.limit}+`}</span>
          {movie?.genres?.map((genre, _) => (
            <span className={classes.ageLimit}>{genre}</span>
          ))}
        </Typography>
        <div className={classes.rating}>
          {adding ? (
            <CircularProgress color="secondary" />
          ) : myMovieListInfo?.isAdded[movie?._id] ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <CheckIcon
                onClick={removeFromMyList}
                style={{ marginBottom: "5px" }}
              />
              <span>My List</span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <Add onClick={addToMyList} style={{ marginBottom: "5px" }} />
              <span>My List</span>
            </div>
          )}
          {!movieInfo[movie?._id]?.like && !movieInfo[movie?._id]?.dislike ? (
            <>
              <ThumbUpAltOutlined onClick={() => handleLike(movie?._id)} />
              <ThumbDownOutlined onClick={() => handledisLike(movie?._id)} />
            </>
          ) : (
            <>
              {movieInfo[movie?._id]?.like ? (
                <ThumbUpAlt onClick={() => handleLike(movie?._id)} />
              ) : (
                <ThumbUpAltOutlined onClick={() => handleLike(movie?._id)} />
              )}

              {movieInfo[movie?._id]?.dislike ? (
                <ThumbDownAlt onClick={() => handledisLike(movie?._id)} />
              ) : (
                <ThumbDownOutlined onClick={() => handledisLike(movie?._id)} />
              )}
            </>
          )}

          {RatingStars}

          <p
            style={{
              marginLeft: "5px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {movieInfo[movie?._id]?.rating}
          </p>
        </div>
        <Typography variant="body1" gutterBottom>
          {movie?.description}
        </Typography>
        <Divider />
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <img
                  src={movie?.imgSm}
                  alt={movie?.title}
                  className={classes.thumbnail}
                />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Watch Now" />

            <Button
              variant="contained"
              color="primary"
              className={classes.watchButton}
              href={`/watch/${movie?._id}`}
              target="_blank"
            >
              Watch
            </Button>
          </ListItem>
          <Divider style={{ backgroundColor: "white" }} />

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ListItem>
                <ListItemText primary="Director(s)" />
              </ListItem>
              {movie?.directors?.map((director, index) => (
                <ListItem key={index}>
                  <ListItemAvatar>
                    <Avatar src={director?.image}>{""}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={director?.name} />
                </ListItem>
              ))}
            </Grid>
            <ListItem>
              <ListItemText primary="Cast" />
            </ListItem>
            {movie?.actors?.map((actor) => (
              <Grid item xs={6} key={actor?.name}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar src={actor?.image}>{actor?.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={actor?.name} />
                </ListItem>
              </Grid>
            ))}
          </Grid>
        </List>
      </DialogContent>
    </div>
  );
};

export default MovieInfoComponent;
