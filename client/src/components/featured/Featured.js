import React, { useEffect, useState, useRef } from "react";
import { InfoOutlined, PlayArrow } from "@material-ui/icons";
import "./featured.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import MovieInfoModal from "../MovieInfo/MovieInfo";
import { useAuth } from "../../context/authContext/AuthContext";
import NoMoviesToDisplay from "../NoMoviesToDisplay/NoMoviesToDisplay";
import SeriesInfoModal from "../SeriesInfo/SeriesInfo";
import Box from "@material-ui/core/Box";

const GET_RANDOM_MOVIE_URL = "http://localhost:8800/api/movies/random?type=";

const Featured = ({ type, setGenre }) => {
  const [randomMovie, setRandomMovie] = useState({});
  const [showInfoModal, setShowInfoModal] = useState(false);
  const { auth, setAuth } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const showMovieInfoModal = () => {
    setShowInfoModal(true);
  };

  const playVideo = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play().catch((error) => {
        console.error("Failed to play the video:", error);
      });
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    //get random movie
    const getRandomMovie = async (type) => {
      try {
        const { data } = await axios.get(`${GET_RANDOM_MOVIE_URL}${type}`, {
          headers: {
            Authorization: auth?.token,
          },
        });

        setRandomMovie(data[0]);
      } catch (error) {
        console.log(error);
      }
    };

    getRandomMovie(type);
  }, [type]);

  const firstEpisode = randomMovie?.seasons?.[0].episodes?.[0];
  const firstSeason = randomMovie?.seasons?.[0]?.number;

  console.log(firstSeason);
  return (
    <div className="featured">
      {type && (
        <div className="category">
          <span>{type === "movies" ? "Movies" : "Series"}</span>
          <select
            name="genre"
            id="genre"
            onChange={(e) => setGenre(e.target.value)}
          >
            <option>Genre</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="comedy">Comedy</option>
            <option value="crime">Crime</option>
            <option value="fantasy">Fantasy</option>
            <option value="historical">Historical</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="sci-fi">Sci-fi</option>
            <option value="thriller">Thriller</option>
            <option value="western">Western</option>
            <option value="animation">Animation</option>
            <option value="drama">Drama</option>
            <option value="documentary">Documentary</option>
          </select>
        </div>
      )}
      {randomMovie ? (
        <>
          <div className="video-container" onClick={playVideo}>
            <video
              ref={videoRef}
              // poster={randomMovie?.img}
              src={randomMovie?.trailer}
              autoPlay
              loop
              width="100%"
              height="100%"
            />
            <div className="video-overlay" />
            {/* <img src={randomMovie?.img} /> */}
            <div className="info">
              {/* <img src={randomMovie?.imgTitle} /> */}
              <Box style={{ backgroundColor: "black", marginBottom: "10px" }}>
                <span className="desc">{randomMovie?.title}</span>
                <br />
                <span className="desc">{randomMovie?.description}</span>
              </Box>

              <div className="buttons">
                <button className="play">
                  <Link
                    to={
                      randomMovie?.isSeries === false
                        ? `/watch/${randomMovie?._id}`
                        : `/watchSeries/${firstSeason}/${firstEpisode?._id}`
                    }
                    className="link"
                  >
                    <PlayArrow />
                  </Link>
                </button>
                <button className="more" onClick={showMovieInfoModal}>
                  <InfoOutlined />
                  <span>Info</span>
                </button>
              </div>
            </div>

            {randomMovie?.isSeries === true && showInfoModal === true ? (
              <SeriesInfoModal
                series={randomMovie}
                open={showInfoModal}
                onClose={setShowInfoModal}
              />
            ) : (
              showInfoModal === true && (
                <MovieInfoModal
                  movie={randomMovie}
                  open={showInfoModal}
                  onClose={setShowInfoModal}
                />
              )
            )}
          </div>
        </>
      ) : (
        <NoMoviesToDisplay />
      )}
    </div>
  );
};

export default Featured;
