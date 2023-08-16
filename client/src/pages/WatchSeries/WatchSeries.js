import { ArrowBackOutlined } from "@material-ui/icons";
import "./watchSeries.scss";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/authContext/AuthContext";
import { makeStyles } from "@material-ui/core/styles";

import axios from "axios";
import { Button } from "@material-ui/core";

const GET_EPISODE_URL = "http://localhost:8800/api/movies/episode/";

const GET_NEXT_EPISODE = "http://localhost:8800/api/movies/nextEpisode/";

// const GET_ALL_EPISODES_URL = "http://localhost:8800/api/movies/episodes/";

const SAVE_LAST_WATCH_POSITION =
  "http://localhost:8800/api/users/saveLastWatchPositionEpisode/";

const GET_LAST_WATCH_POSITION =
  "http://localhost:8800/api/users/getLastWatchPositionEpisode/";

const DELETE_LAST_WATCH_POSITION =
  "http://localhost:8800/api/users/deleteLastWatchPositionEpisode/";

const UPDATE_TIME_SPENT =
  "http://localhost:8800/api/users/updateTimeSpentWatchingSeries/";

const useStyles = makeStyles((theme) => ({
  resetLastWatch: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e50914",
    color: "#fff",

    "&:hover": {
      backgroundColor: "#b20710",
    },
  },
}));

const WatchSeries = () => {
  const { id, seasonNumber } = useParams();
  const [showIntro, setShowIntro] = useState(true);
  const [videoIntroDuration, setIntroVideoDuration] = useState(0);
  const [videoDuration, setVideoDuration] = useState();

  const [episode, setEpisode] = useState({});
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(
    videoDuration - currentTime
  );
  const [showNextEpisodeMessage, setShowNextEpisodeMessage] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [startTime, setStartTime] = useState(Date.now());
  // const [timeSpent, setTimeSpent] = useState(0);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      localStorage.setItem("timeSpentWatchingSeries", currentTime - startTime);
    }, 1000);

    return () => {
      clearInterval(interval);
      saveTimeSpent();
    };
  }, [startTime]);

  const saveTimeSpent = async () => {
    try {
      const currentDate = new Date().toISOString().split("T")[0];
      const { data } = await axios.post(
        `${UPDATE_TIME_SPENT}${auth?.user._id}`,
        {
          date: currentDate,
          timeSpent: localStorage.getItem("timeSpentWatchingSeries"),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleVideoIntroDuration = (event) => {
    setIntroVideoDuration(event.target.duration);
  };
  const handleVideoDuration = (event) => {
    setVideoDuration(event.target.duration);
  };

  useEffect(() => {
    if (videoIntroDuration > 0) {
      setTimeout(() => {
        setShowIntro(false);
      }, videoIntroDuration * 1000);
    }
  }, [videoIntroDuration]);

  useEffect(() => {
    const getEpisode = async () => {
      try {
        const { data } = await axios.get(`${GET_EPISODE_URL}${id}`);
        setEpisode(data);
      } catch (error) {
        console.log(error);
      }
    };

    getEpisode();
  }, [id]);

  const deleteLastWatchPosition = async () => {
    try {
      const { data } = await axios.delete(
        `${DELETE_LAST_WATCH_POSITION}${auth?.user?._id}/${id}`
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getNextEpisode = async () => {
    try {
      const { data } = await axios.get(`${GET_NEXT_EPISODE}${id}`);
      setShowNextEpisodeMessage(false);
      navigate(`/watchSeries/${seasonNumber}/${data.id}`);
    } catch (error) {
      console.log(error);
      if (error.response.status === 404) {
        navigate("/series");
      }
    }
  };

  const handleVideoEnded = () => {
    deleteLastWatchPosition();
    getNextEpisode();
  };

  const handleTimeUpdate = async () => {
    const video = videoRef.current;
    const currentTime = video.currentTime;

    setCurrentTime(currentTime);
    localStorage.setItem("currentTimeEpisode", currentTime);
    localStorage.setItem("duration", episode.duration);
    let rem = Math.ceil(videoDuration - currentTime);
    setRemainingTime(rem);
    if (remainingTime <= 10) {
      setShowNextEpisodeMessage(true);
      setCountdown(remainingTime);
    } else if (remainingTime > 10) {
      setShowNextEpisodeMessage(false);
    }
    if (rem === 0) {
      setShowNextEpisodeMessage(false);
    }
    console.log(videoDuration);
    console.log(currentTime);
    console.log(rem);
    console.log(showNextEpisodeMessage);
  };

  const handleLoadedData = () => {
    setShowNextEpisodeMessage(false);
    const video = videoRef.current;
    video.currentTime = currentTime;
  };

  useEffect(() => {
    const saveLastWatchPosition = async () => {
      try {
        const data = await axios.put(
          `${SAVE_LAST_WATCH_POSITION}${auth?.user?._id}/${seasonNumber}/${id}`,
          {
            lastWatchPosition: localStorage.getItem("currentTimeEpisode"),
            duration: localStorage.getItem("duration"),
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    window.addEventListener("beforeunload", saveLastWatchPosition);

    // Return the cleanup function to remove the event listener and save the last watching position
    return () => {
      window.removeEventListener("beforeunload", saveLastWatchPosition);
      saveLastWatchPosition();
    };
  }, [id]);

  console.log(episode.duration);

  useEffect(() => {
    const getLastWatchPosition = async () => {
      try {
        const { data } = await axios.get(
          `${GET_LAST_WATCH_POSITION}${auth?.user?._id}/${id}`
        );

        setCurrentTime(data.lastWatchPosition);

        localStorage.setItem("currentTimeEpisode", data.lastWatchPosition);

        localStorage.getItem("currentTimeEpisode") > 0 && setShowIntro(false);
      } catch (error) {
        console.log(error);
      }
    };
    getLastWatchPosition();
  }, []);

  const classes = useStyles();

  return (
    <div className="watch">
      {showIntro && (
        <video
          src="https://firebasestorage.googleapis.com/v0/b/netflix-55a24.appspot.com/o/Y2Mate.is%20-%20Netflix%20New%20Logo%20Animation%202019-GV3HUDMQ-F8-1080p-1657032459678.mp4?alt=media&token=e7f61373-6253-4886-8c99-dbbbd6e87aa5"
          width="100%"
          height="100%"
          autoPlay
          onLoadedMetadata={(e) => handleVideoIntroDuration(e)}
        />
      )}
      <Link to="/series">
        <div className="back">
          <ArrowBackOutlined />
          Home
        </div>
      </Link>

      {!showIntro && (
        <div
          style={{
            position: "relative",
          }}
        >
          <video
            className="video"
            src={episode.video}
            poster={episode?.thumbnail}
            controls
            autoPlay
            crossOrigin="anonymous"
            ref={videoRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedData={handleLoadedData}
            onLoadedMetadata={(e) => handleVideoDuration(e)}
            onEnded={handleVideoEnded}
            style={{ width: "100%" }}
          >
            <track
              src={episode.subtitles}
              label="Hebrew"
              kind="subtitles"
              srcLang="heb"
            />
          </video>
          {showNextEpisodeMessage && (
            <div
              style={{
                position: "absolute",
                top: "85%",
                left: "85%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <p style={{ fontSize: "24px" }}>
                Next episode in {countdown} seconds...
              </p>
              <Button
                variant="contained"
                className={classes.resetLastWatch}
                onClick={getNextEpisode}
                target="_blank"
              >
                Next Episode
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WatchSeries;
