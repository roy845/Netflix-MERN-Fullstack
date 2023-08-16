import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  Add,
  PlayArrow,
  ThumbDownOutlined,
  ThumbUpAltOutlined,
  ThumbDownAlt,
  ThumbUpAlt,
  StarOutline,
  Star,
} from "@material-ui/icons";
import RestoreIcon from "@material-ui/icons/Restore";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/userContext/UserContext";
import { toast } from "react-hot-toast";
import {
  Button,
  CircularProgress,
  LinearProgress,
  Tooltip,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { useAuth } from "../../context/authContext/AuthContext";
import { makeStyles } from "@material-ui/core/styles";

const GET_MOVIE_URL = "http://localhost:8800/api/movies/find/";
const GET_MOVIE_RATINGS = "http://localhost:8800/api/users/movieLikes/";
const UPDATE_MOVIE_RATINGS = "http://localhost:8800/api/users/movieLikes/";
const GET_MY_LIST_URL = "http://localhost:8800/api/users/getMyMoviesList/";
const UPDATE_MY_LIST_URL = "http://localhost:8800/api/users/updateMyMovieList/";
const ADD_TO_MY_LIST_URL = "http://localhost:8800/api/users/addToMyListMovies/";
const REMOVE_FROM_MY_LIST_URL =
  "http://localhost:8800/api/users/removeMyListMovies/";

const GET_LAST_WATCH_POSITION =
  "http://localhost:8800/api/users/getLastWatchPosition/";

const DELETE_LAST_WATCH_POSITION =
  "http://localhost:8800/api/users/deleteLastWatchPosition/";

const useStyles = makeStyles((theme) => ({
  resetLastWatch: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    marginLeft: "5px",

    "&:hover": {
      color: "gray",
    },
  },
}));

export default React.memo(function MovieCard({ index, item }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [movie, setMovie] = useState({});
  const { auth, setAuth } = useAuth();

  const [hasMovieInfoChanged, setHasMovieInfoChanged] = useState(false);
  const { movieInfo, setMovieInfo, myMovieListInfo, setMyMovieListInfo } =
    useContext(UserContext);
  const [adding, setAdding] = useState(false);
  const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState(0);
  const [progress, setProgress] = useState(0);

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
      onClick={() => handleStarIconClick(movie._id, index + 1)}
    />
  ));

  const RatingStars = icons.map((icon, index) =>
    index < movieInfo[movie._id]?.rating ? (
      <Star
        key={index}
        onClick={() => handleStarIconClick(movie._id, index + 1)}
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

  const updateMovieList = async (movieList) => {
    if (hasMovieInfoChanged) {
      try {
        const { data } = await axios.put(
          `${UPDATE_MY_LIST_URL}${auth?.user?._id}`,
          movieList
        );

        setMyMovieListInfo(data);
      } catch (error) {
        console.log(error);
      }
      setHasMovieInfoChanged(false);
    }
  };

  const getMyList = async () => {
    try {
      const { data } = await axios.get(`${GET_MY_LIST_URL}${auth?.user?._id}`);

      setMyMovieListInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyList();
  }, []);

  useEffect(() => {
    const getMovie = async () => {
      try {
        const res = await axios.get(`${GET_MOVIE_URL}${item}`, {
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
  }, [item]);

  useEffect(() => {
    fetchUserMovieInfo();
  }, []);

  const onMouseEnter = () => {
    setIsHovered(true);
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

  const addToMyList = async () => {
    try {
      setAdding(true);
      const { data } = await axios.post(
        `${ADD_TO_MY_LIST_URL}${auth?.user?._id}`,
        { listTitle: "My Movies List", movieId: movie._id }
      );
      setAdding(false);
      setMyMovieListInfo(data);
      setHasMovieInfoChanged(true);
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
      toast.success(`${movie.title} removed from ${myMovieListInfo.title}`);
      setMyMovieListInfo(data);
      setHasMovieInfoChanged(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onMouseLeave = async () => {
    setIsHovered(false);
    updateMovieInfo(movieInfo);
    updateMovieList(myMovieListInfo);
  };

  useEffect(() => {
    const getLastWatchPosition = async () => {
      try {
        const { data } = await axios.get(
          `${GET_LAST_WATCH_POSITION}${auth?.user?._id}/${movie._id}`
        );

        const currentTimeInSeconds = data.lastWatchPosition;
        setCurrentTimeInSeconds(currentTimeInSeconds);
        const percentageWatched =
          (currentTimeInSeconds / (movie.duration * 60)) * 100;
        setProgress(percentageWatched);
      } catch (error) {
        console.log(error);
      }
    };
    getLastWatchPosition();
  }, [item, isHovered]);

  const deleteLastWatchPosition = async () => {
    try {
      const { data } = await axios.delete(
        `${DELETE_LAST_WATCH_POSITION}${auth?.user?._id}/${movie._id}`
      );
      setProgress(0);
      setCurrentTimeInSeconds(0);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const classes = useStyles();

  return (
    <Container onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <img src={movie?.imgSm} alt="" />
      {isHovered && (
        <div className="hover">
          <div className="image-video-container">
            <Link to={{ pathname: `/watch/${movie?._id}` }} className="link">
              <video src={movie.trailer} autoPlay loop />
            </Link>
          </div>
          <div className="info-container ">
            <h3 className="name">{movie.title}</h3>
            <div className="icons ">
              <div className="controls">
                <Link
                  to={{ pathname: `/watch/${movie?._id}` }}
                  className="link"
                >
                  <PlayArrow className="icon" />
                </Link>
                {adding ? (
                  <CircularProgress color="secondary" />
                ) : myMovieListInfo?.isAdded[movie._id] ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Tooltip title="Remove From My List">
                      <CheckIcon className="icon" onClick={removeFromMyList} />
                    </Tooltip>
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <Tooltip title="Add To My List">
                      <Add onClick={addToMyList} className="icon" />
                    </Tooltip>
                  </div>
                )}

                {!movieInfo[movie._id]?.like &&
                !movieInfo[movie._id]?.dislike ? (
                  <>
                    <ThumbUpAltOutlined
                      className="icon"
                      onClick={() => handleLike(movie._id)}
                    />
                    <ThumbDownOutlined
                      className="icon"
                      onClick={() => handledisLike(movie._id)}
                    />
                  </>
                ) : (
                  <>
                    {movieInfo[movie._id]?.like ? (
                      <ThumbUpAlt
                        className="icon"
                        onClick={() => handleLike(movie._id)}
                      />
                    ) : (
                      <ThumbUpAltOutlined
                        className="icon"
                        onClick={() => handleLike(movie._id)}
                      />
                    )}

                    {movieInfo[movie._id]?.dislike ? (
                      <ThumbDownAlt
                        className="icon"
                        onClick={() => handledisLike(movie._id)}
                      />
                    ) : (
                      <ThumbDownOutlined
                        className="icon"
                        onClick={() => handledisLike(movie._id)}
                      />
                    )}
                  </>
                )}

                {RatingStars}

                <p
                  style={{
                    marginLeft: "5px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {movieInfo[movie._id]?.rating}
                </p>
              </div>
              <div className="info">
                <span
                  style={{
                    backgroundColor: "#bf7402",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "5px",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    marginLeft: "1px",
                  }}
                >
                  {movie.duration}
                </span>
                <span
                  style={{
                    backgroundColor: "#f44336",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "5px",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    marginLeft: "1px",
                  }}
                >
                  +{movie.limit}
                </span>
                <span
                  style={{
                    backgroundColor: "#015908",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "5px",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    marginLeft: "1px",
                  }}
                >
                  {movie.year}
                </span>
                {movie?.genres.map((genre, _) => (
                  <span
                    style={{
                      backgroundColor: "#f44336",
                      color: "#fff",
                      padding: "5px",
                      borderRadius: "5px",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      marginLeft: "1px",
                    }}
                  >
                    {genre}
                  </span>
                ))}
                {progress != 0 && (
                  <Tooltip title="Restart last watch position">
                    <RestoreIcon
                      variant="contained"
                      className={classes.resetLastWatch}
                      onClick={() => deleteLastWatchPosition(movie._id)}
                      target="_blank"
                    />
                  </Tooltip>
                )}
              </div>
              <LinearProgress
                variant="determinate"
                value={progress}
                style={{ flex: 1 }}
              />
              <style jsx global>{`
                .MuiLinearProgress-barColorPrimary {
                  background-color: #bf1131;
                }
                .MuiLinearProgress-bar1Buffer {
                  background-color: #d8d8d8;
                }
              `}</style>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span>{`${Math.floor(currentTimeInSeconds / 60)}:${(
                  "0" + Math.floor(currentTimeInSeconds % 60)
                ).slice(-2)} / ${movie.duration} minutes`}</span>
              </div>

              <div className="desc">{movie.description}</div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
});

const Container = styled.div`
  max-width: 230px;
  width: 230px;
  height: 100%;
  cursor: pointer;
  position: relative;
  .limit {
    border: 1px solid gray;
    padding: 1px 3px;
    margin: 0 10px;
  }
  .info {
    margin-top: 5px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
    color: gray;
  }
  img {
    border-radius: 0.2rem;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .hover {
    z-index: 99;
    height: max-content;
    width: 30rem;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 0.3rem;
    box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 10px;
    background-color: #000000;
    color: white;
    transition: 0.3s ease-in-out;
    .image-video-container {
      position: relative;
      height: 140px;
      img {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 4;
        position: absolute;
      }
      video {
        width: 100%;
        height: 140px;
        object-fit: cover;
        border-radius: 0.3rem;
        top: 0;
        z-index: 5;
        position: absolute;
      }
    }
    .info-container {
      padding: 1rem;
      gap: 0.5rem;
    }
    .icons {
      .controls {
        display: flex;
        gap: 1rem;
      }
      svg {
        font-size: 2rem;
        cursor: pointer;
        transition: 0.3s ease-in-out;
        &:hover {
          color: #b8b8b8;
        }
      }
    }
    .genres {
      font-size: 24px;
    }
    .desc {
      font-size: 20px;
    }
  }
`;
