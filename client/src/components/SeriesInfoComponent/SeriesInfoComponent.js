import { useState, useEffect, useContext } from "react";
import "./seriesInfoComponent.scss";
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
const ADD_TO_MY_LIST_URL = "http://localhost:8800/api/users/addToMyListSeries/";
const REMOVE_FROM_MY_LIST_URL =
  "http://localhost:8800/api/users/removeMyListSeries/";

const GET_SERIES_URL = "http://localhost:8800/api/movies/find/series/";

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

const SeriesInfoComponent = () => {
  const { sId } = useParams();
  const [series, setSeries] = useState({});
  const navigate = useNavigate();
  console.log(sId);
  const [selectedSeason, setSelectedSeason] = useState(
    series?.seasons?.[0]?.number
  );

  useEffect(() => {
    const getSeries = async () => {
      try {
        const { data } = await axios.get(`${GET_SERIES_URL}${sId}`);
        setSeries(data);
      } catch (error) {
        console.log(error);
      }
    };

    getSeries();
  }, []);

  const classes = useStyles();
  const [hasMovieInfoChanged, setHasMovieInfoChanged] = useState(false);
  const { movieInfo, setMovieInfo, mySeriesListInfo, setMySeriesListInfo } =
    useContext(UserContext);
  const [adding, setAdding] = useState(false);
  const { auth, setAuth } = useAuth();

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
      onClick={() => handleStarIconClick(series?._id, index + 1)}
    />
  ));

  const RatingStars = icons?.map((icon, index) =>
    index < movieInfo[series?._id]?.rating ? (
      <Star
        key={index}
        onClick={() => handleStarIconClick(series?._id, index + 1)}
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
          listTitle: "My Series List",
          seriesId: series._id,
        }
      );
      setAdding(false);
      setMySeriesListInfo(data);
      toast.success(`${series.title} added to ${data.title}`);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFromMyList = async () => {
    try {
      setAdding(true);
      const { data } = await axios.delete(
        `${REMOVE_FROM_MY_LIST_URL}${auth?.user?._id}/${series._id}`
      );
      setAdding(false);
      toast.success(`${series?.title} removed from ${mySeriesListInfo.title}`);
      setMySeriesListInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeasonSelect = (event) => {
    setSelectedSeason(parseInt(event.target.value));
  };

  const episodes = series?.seasons
    ?.find((season) => season?.number === selectedSeason)
    ?.episodes.map((episode, index) => {
      const hours = Math.floor(episode?.duration / 60);
      const minutes = episode?.duration % 60;
      const durationText =
        hours === 0 ? `${minutes} Minutes` : `${hours} ${minutes} Minutes`;

      return (
        <Grid item xs={6} key={episode?.title}>
          <div
            key={episode?.title}
            style={{
              display: "flex",
              flexDirection: "column",
              color: "white",
              border: "solid white 1px",
              marginTop: "10px",
            }}
          >
            <video
              key={episode?.title}
              className="video"
              controls
              crossOrigin="anonymous"
              src={episode?.video}
              poster={episode?.thumbnail}
            >
              <track
                key={episode?.title}
                src={episode?.subtitles}
                label="Hebrew"
                kind="subtitles"
                srcLang="heb"
              />
            </video>

            <h4 key={episode?.title}>
              {index + 1}. {episode?.title}
            </h4>
            <p key={episode?.title}>{episode?.description}</p>
            <p key={episode?.title}>{durationText}</p>
          </div>
        </Grid>
      );
    });

  const seasonOptions = series?.seasons?.map((season) => (
    <option key={season?.number} value={season?.number}>
      Season {season?.number}
    </option>
  ));

  return (
    <div className={classes.dialog}>
      <ArrowForwardIosIcon
        className={classes.closeButton}
        onClick={handleClose}
      />

      <DialogTitle id="movie-info-dialog-title">{series?.title}</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <video src={series?.trailer} className={classes.poster} controls />
        <Typography variant="subtitle1" gutterBottom>
          <span className={classes.ageLimit}>{`${series?.limit}+`}</span>
          {series?.genres?.map((genre, _) => (
            <span key={genre} className={classes.ageLimit}>
              {genre}
            </span>
          ))}
        </Typography>
        <div className={classes.rating}>
          {adding ? (
            <CircularProgress color="secondary" />
          ) : mySeriesListInfo?.isAdded[series?._id] ? (
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
          {!movieInfo[series?._id]?.like && !movieInfo[series?._id]?.dislike ? (
            <>
              <ThumbUpAltOutlined onClick={() => handleLike(series?._id)} />
              <ThumbDownOutlined onClick={() => handledisLike(series?._id)} />
            </>
          ) : (
            <>
              {movieInfo[series?._id]?.like ? (
                <ThumbUpAlt onClick={() => handleLike(series?._id)} />
              ) : (
                <ThumbUpAltOutlined onClick={() => handleLike(series?._id)} />
              )}

              {movieInfo[series?._id]?.dislike ? (
                <ThumbDownAlt onClick={() => handledisLike(series?._id)} />
              ) : (
                <ThumbDownOutlined onClick={() => handledisLike(series?._id)} />
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
            {movieInfo[series?._id]?.rating}
          </p>
        </div>
        <Typography variant="body1" gutterBottom>
          {series?.description}
        </Typography>
        <Divider />
        <List>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <img
                  src={series?.imgSm}
                  alt={series?.title}
                  className={classes.thumbnail}
                />
              </Avatar>
            </ListItemAvatar>
          </ListItem>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <ListItem>
                <ListItemText primary="Director(s)" />
              </ListItem>
              {series?.directors?.map((director, index) => (
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
            {series?.actors?.map((actor) => (
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
          <Divider style={{ backgroundColor: "white" }} />
          <div className="select-container">
            <select value={selectedSeason} onChange={handleSeasonSelect}>
              {seasonOptions}
            </select>
          </div>
          <Grid container spacing={2}>
            {episodes}
          </Grid>
        </List>
      </DialogContent>
    </div>
  );
};

export default SeriesInfoComponent;
