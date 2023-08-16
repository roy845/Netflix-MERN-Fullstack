import { ArrowBackOutlined } from "@material-ui/icons";
import "./watch.scss";
import { useParams, useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { getMovie } from "../../context/movieContext/apiCalls";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext/AuthContext";
import { toast } from "react-hot-toast";

const SAVE_LAST_WATCH_POSITION =
  "http://localhost:8800/api/users/saveLastWatchPosition/";

const GET_LAST_WATCH_POSITION =
  "http://localhost:8800/api/users/getLastWatchPosition/";

const DELETE_LAST_WATCH_POSITION =
  "http://localhost:8800/api/users/deleteLastWatchPosition/";

const UPDATE_TIME_SPENT =
  "http://localhost:8800/api/users/updateTimeSpentWatchingMovies/";

const Watch = () => {
  const { movie, dispatch } = useContext(MovieContext);
  const { id } = useParams();
  const { auth, setAuth } = useAuth();
  const [showIntro, setShowIntro] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  // const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = Date.now();
      localStorage.setItem("timeSpentWatchingMovies", currentTime - startTime);
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
          timeSpent: localStorage.getItem("timeSpentWatchingMovies"),
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();
  const handleVideoDuration = (event) => {
    setVideoDuration(event.target.duration);
  };

  useEffect(() => {
    if (videoDuration > 0) {
      setTimeout(() => {
        setShowIntro(false);
      }, videoDuration * 1000);
    }
  }, [videoDuration]);

  useEffect(() => {
    getMovie(id, dispatch);
  }, [id, dispatch]);

  const handleTimeUpdate = async () => {
    const video = videoRef.current;
    const currentTime = video.currentTime;

    setCurrentTime(currentTime);
    localStorage.setItem("currentTime", currentTime);
  };

  const handleLoadedData = () => {
    const video = videoRef.current;
    video.currentTime = currentTime;
  };

  useEffect(() => {
    const saveLastWatchPosition = async () => {
      try {
        const data = await axios.put(
          `${SAVE_LAST_WATCH_POSITION}${auth?.user?._id}/${id}`,
          {
            lastWatchPosition: localStorage.getItem("currentTime"),
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

  useEffect(() => {
    const getLastWatchPosition = async () => {
      try {
        const { data } = await axios.get(
          `${GET_LAST_WATCH_POSITION}${auth?.user?._id}/${id}`
        );

        setCurrentTime(data.lastWatchPosition);
        localStorage.setItem("currentTime", data.lastWatchPosition);
        localStorage.getItem("currentTime") > 0 && setShowIntro(false);
      } catch (error) {
        console.log(error);
      }
    };
    getLastWatchPosition();
  }, []);

  const deleteLastWatchPosition = async () => {
    try {
      const { data } = await axios.delete(
        `${DELETE_LAST_WATCH_POSITION}${auth?.user?._id}/${movie._id}`
      );
      toast.success(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEndedVideo = () => {
    deleteLastWatchPosition();
    navigate("/");
  };

  return (
    <div className="watch">
      {showIntro && (
        <video
          src="https://firebasestorage.googleapis.com/v0/b/netflix-55a24.appspot.com/o/Y2Mate.is%20-%20Netflix%20New%20Logo%20Animation%202019-GV3HUDMQ-F8-1080p-1657032459678.mp4?alt=media&token=e7f61373-6253-4886-8c99-dbbbd6e87aa5"
          width="100%"
          height="100%"
          autoPlay
          onLoadedMetadata={(e) => handleVideoDuration(e)}
        />
      )}
      <Link to="/">
        <div className="back">
          <ArrowBackOutlined />
          Home
        </div>
      </Link>

      {!showIntro && (
        <video
          poster={movie.img}
          className="video"
          src={movie.video}
          controls
          autoPlay
          crossOrigin="anonymous"
          ref={videoRef}
          onEnded={handleEndedVideo}
          onTimeUpdate={handleTimeUpdate}
          onLoadedData={handleLoadedData}
        >
          <track
            src={movie?.subtitles}
            label="Hebrew"
            kind="subtitles"
            srcLang="heb"
          />
        </video>
      )}
    </div>
  );
};

export default Watch;
