import React, { useState, useEffect, useContext, useRef } from "react";
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
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/userContext/UserContext";
import { toast } from "react-hot-toast";
import { CircularProgress, Tooltip } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { useAuth } from "../../context/authContext/AuthContext";
import SeriesInfoModal from "../SeriesInfo/SeriesInfo";

const GET_SERIES_URL = "http://localhost:8800/api/movies/find/series/";
const GET_MOVIE_RATINGS = "http://localhost:8800/api/users/movieLikes/";
const UPDATE_MOVIE_RATINGS = "http://localhost:8800/api/users/movieLikes/";
const GET_MY_LIST_URL = "http://localhost:8800/api/users/getMySeriesList/";
const UPDATE_MY_LIST_URL =
  "http://localhost:8800/api/users/updateMySeriesList/";
const ADD_TO_MY_LIST_URL = "http://localhost:8800/api/users/addToMyListSeries/";
const REMOVE_FROM_MY_LIST_URL =
  "http://localhost:8800/api/users/removeMyListSeries/";

export default React.memo(function SeriesCard({ index, item }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [series, setSeries] = useState({});
  const { auth, setAuth } = useAuth();

  const [hasMovieInfoChanged, setHasMovieInfoChanged] = useState(false);
  const { movieInfo, setMovieInfo, mySeriesListInfo, setMySeriesListInfo } =
    useContext(UserContext);
  const [adding, setAdding] = useState(false);
  const [closeModalSeriesInfo, setCloseModalSeriesInfo] = useState(false);
  const videoRef = useRef(null);

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
      onClick={() => handleStarIconClick(series._id, index + 1)}
    />
  ));

  const RatingStars = icons.map((icon, index) =>
    index < movieInfo[series._id]?.rating ? (
      <Star
        key={index}
        onClick={() => handleStarIconClick(series._id, index + 1)}
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

        setMySeriesListInfo(data);
      } catch (error) {
        console.log(error);
      }
      setHasMovieInfoChanged(false);
    }
  };

  const getMyList = async () => {
    try {
      const { data } = await axios.get(`${GET_MY_LIST_URL}${auth?.user?._id}`);

      setMySeriesListInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyList();
  }, []);

  useEffect(() => {
    const getSeries = async () => {
      try {
        const res = await axios.get(`${GET_SERIES_URL}${item}`, {
          headers: {
            token: "Bearer " + JSON.parse(localStorage.getItem("auth")).token,
          },
        });
        setSeries(res?.data);
      } catch (err) {
        console.log(err);
      }
    };
    getSeries();
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
        { listTitle: "My Series List", seriesId: series._id }
      );
      setAdding(false);
      setMySeriesListInfo(data);
      setHasMovieInfoChanged(true);
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
      toast.success(`${series.title} removed from ${mySeriesListInfo.title}`);
      setMySeriesListInfo(data);
      setHasMovieInfoChanged(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onMouseLeave = async () => {
    setIsHovered(false);
    updateMovieInfo(movieInfo);
    updateMovieList(mySeriesListInfo);
  };

  return (
    <Container onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <img src={series?.imgSm} alt="" />
      {isHovered && (
        <div className="hover">
          <div className="image-video-container">
            <Link
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.pause();
                }
                setCloseModalSeriesInfo(true);
              }}
              className="link"
            >
              <video ref={videoRef} src={series.trailer} autoPlay loop />
            </Link>
          </div>
          <div className="info-container ">
            <h3 className="name">{series.title}</h3>
            <div className="icons ">
              <div className="controls">
                <Link
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.pause();
                    }
                    setCloseModalSeriesInfo(true);
                  }}
                  className="link"
                >
                  <PlayArrow className="icon" />
                </Link>
                {adding ? (
                  <CircularProgress color="secondary" />
                ) : mySeriesListInfo?.isAdded[series._id] ? (
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

                {!movieInfo[series._id]?.like &&
                !movieInfo[series._id]?.dislike ? (
                  <>
                    <ThumbUpAltOutlined
                      className="icon"
                      onClick={() => handleLike(series._id)}
                    />
                    <ThumbDownOutlined
                      className="icon"
                      onClick={() => handledisLike(series._id)}
                    />
                  </>
                ) : (
                  <>
                    {movieInfo[series._id]?.like ? (
                      <ThumbUpAlt
                        className="icon"
                        onClick={() => handleLike(series._id)}
                      />
                    ) : (
                      <ThumbUpAltOutlined
                        className="icon"
                        onClick={() => handleLike(series._id)}
                      />
                    )}

                    {movieInfo[series._id]?.dislike ? (
                      <ThumbDownAlt
                        className="icon"
                        onClick={() => handledisLike(series._id)}
                      />
                    ) : (
                      <ThumbDownOutlined
                        className="icon"
                        onClick={() => handledisLike(series._id)}
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
                  {movieInfo[series._id]?.rating}
                </p>
              </div>
              <div className="info">
                {/* <span
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
                  {series.duration}
                </span> */}
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
                  +{series.limit}
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
                  {series.year}
                </span>
                {series?.genres.map((genre, _) => (
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
              </div>
              <div className="desc">{series.description}</div>
            </div>
          </div>
        </div>
      )}

      <SeriesInfoModal
        key={series._id}
        open={closeModalSeriesInfo}
        series={series}
        onClose={setCloseModalSeriesInfo}
        videoRef={videoRef}
      />
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
