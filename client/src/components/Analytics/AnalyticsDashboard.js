import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext/AuthContext";
import { makeStyles } from "@material-ui/core/styles";
import { PlayCircleOutline, Tv } from "@material-ui/icons";
import { ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import Topbar from "../../pages/admin/components/topbar/Topbar";
import "../../pages/admin/components/sidebar/sidebar.scss";
import { UserContext } from "../../context/userContext/UserContext";
import MoviesAnalytics from "./MoviesAnalytics";
import SeriesAnalytics from "./SeriesAnalytics";
import CircularSpinner from "../spinner/CircularSpinner";
import NoAnalyticData from "../NoAnalyticData/NoAnalyticData";

const GET_TIME_SPENT_WATCHING_MOVIES =
  "http://localhost:8800/api/users/getTimeSpentWatchingMovies/";
const GET_TIME_SPENT_WATCHING_SERIES =
  "http://localhost:8800/api/users/getTimeSpentWatchingSeries/";

const BASE_IMAGE_URL = "http://localhost:8800/api/users/getUserPhoto/";

const generateRandomColor = () => {
  const minBrightness = 0.6; // Minimum brightness value (0-1)
  let color = "#000000"; // Start with black color

  while (color === "#000000") {
    // Generate random RGB values
    const red = Math.floor(Math.random() * 256);
    const green = Math.floor(Math.random() * 256);
    const blue = Math.floor(Math.random() * 256);

    // Calculate brightness of the color
    const brightness = (red * 0.299 + green * 0.587 + blue * 0.114) / 255;

    // Check if the brightness is higher than the minimum
    if (brightness >= minBrightness) {
      // Convert RGB values to hex format
      color = `#${red.toString(16).padStart(2, "0")}${green
        .toString(16)
        .padStart(2, "0")}${blue.toString(16).padStart(2, "0")}`;
    }
  }

  return color;
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  toggleButton: {
    backgroundColor: "black",
    color: generateRandomColor(),
    border: `1px solid ${generateRandomColor()}`,
    "&.Mui-selected": {
      backgroundColor: generateRandomColor(),
      color: "black",
      "&:hover": {
        backgroundColor: generateRandomColor(),
      },
    },
  },
}));

const AnalyticsDashboard = () => {
  const [timeSpentWatchingMovies, setTimeSpentWatchingMovies] = useState([]);
  const [timeSpentWatchingSeries, setTimeSpentWatchingSeries] = useState([]);
  const [fetchingContent, setFetchingContent] = useState("movies");
  const { auth, setAuth } = useAuth();
  const { defaultAvatar } = useContext(UserContext);

  const classes = useStyles();

  useEffect(() => {
    const getTimeSpentWatchingMovies = async () => {
      try {
        const { data } = await axios.get(
          `${GET_TIME_SPENT_WATCHING_MOVIES}${auth?.user._id}`
        );
        console.log(data);
        // Convert timeSpent field to minutes and exclude _id and id fields
        const convertedData = data.timeSpentWatchingMovies.map(
          ({ _id, id, timeSpent, ...rest }) => {
            const convertedTimeSpent = parseFloat(
              (timeSpent / 60000).toFixed(2)
            ); // Convert milliseconds to minutes
            return { ...rest, timeSpent: convertedTimeSpent };
          }
        );

        // Sort the data based on the date field in descending order
        const sortedData = convertedData.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setTimeSpentWatchingMovies(sortedData);
      } catch (error) {
        console.log(error);
      }
    };
    getTimeSpentWatchingMovies();
  }, []);

  useEffect(() => {
    const getTimeSpentWatchingSeries = async () => {
      try {
        const { data } = await axios.get(
          `${GET_TIME_SPENT_WATCHING_SERIES}${auth?.user._id}`
        );
        console.log(data);
        // Convert timeSpent field to minutes and exclude _id and id fields
        const convertedData = data.timeSpentWatchingSeries.map(
          ({ _id, id, timeSpent, ...rest }) => {
            const convertedTimeSpent = parseFloat(
              (timeSpent / 60000).toFixed(2)
            ); // Convert milliseconds to minutes
            return { ...rest, timeSpent: convertedTimeSpent };
          }
        );

        // Sort the data based on the date field in descending order
        const sortedData = convertedData.sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        });

        setTimeSpentWatchingSeries(sortedData);
      } catch (error) {
        console.log(error);
      }
    };
    getTimeSpentWatchingSeries();
  }, []);

  const handlefetchContentModeChange = (event, newChartMode) => {
    setFetchingContent(newChartMode);
  };

  console.log(fetchingContent);

  return (
    <div className={classes.root}>
      <Topbar
        title={"Analytics Dashboard"}
        imgSrc={
          auth?.user?.profilePic?.data?.data.length === 0
            ? defaultAvatar
            : `${BASE_IMAGE_URL}${auth?.user?._id}?t=${Date.now()}`
        }
      />

      {timeSpentWatchingMovies?.length === 0 &&
      timeSpentWatchingSeries?.length === 0 ? (
        <>
          <NoAnalyticData />
        </>
      ) : (
        <>
          <h1
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
              color: generateRandomColor(),
            }}
          >
            {fetchingContent === "movies"
              ? "Time Spent Watching Movies (In Minutes)"
              : "Time Spent Watching Series (In Minutes)"}
          </h1>
          <ToggleButtonGroup
            value={fetchingContent}
            exclusive
            onChange={handlefetchContentModeChange}
            aria-label="display mode"
            style={{
              marginBottom: "20px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <ToggleButton
              value="movies"
              aria-label="movies"
              className={classes.toggleButton}
            >
              <PlayCircleOutline />
              Movies
            </ToggleButton>
            <ToggleButton
              value="series"
              aria-label="series"
              className={classes.toggleButton}
            >
              <Tv />
              Series
            </ToggleButton>
          </ToggleButtonGroup>
          {fetchingContent === "movies" ? (
            <MoviesAnalytics
              timeSpentWatchingMovies={timeSpentWatchingMovies}
            />
          ) : (
            <SeriesAnalytics
              timeSpentWatchingSeries={timeSpentWatchingSeries}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
