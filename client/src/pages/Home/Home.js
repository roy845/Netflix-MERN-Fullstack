import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../components/navbar/Navbar";
import Featured from "../../components/featured/Featured";
import "./Home.scss";
import { ListContext } from "../../context/listContext/ListContext";
import { getRandomLists } from "../../context/listContext/apiCalls";
import HomeSpinner from "../../components/spinner/HomeSpinner";
import { UserContext } from "../../context/userContext/UserContext";
import { AuthContext } from "../../context/authContext/AuthContext";
import axios from "axios";
import SplashScreen from "../../components/SplashScreen/SplashScreen";
import { toast } from "react-hot-toast";
import MoviesRow from "../../components/MoviesRow/MoviesRow";
import SeriesRow from "../../components/SeriesRow/SeriesRow";

const GET_MY_SERIES_LIST_URL =
  "http://localhost:8800/api/users/getMySeriesList/";
const GET_MY_MOVIE_LIST_URL =
  "http://localhost:8800/api/users/getMyMoviesList/";
const GET_MY_NOTIFICATIONS_LIST =
  "http://localhost:8800/api/users/getMyNotifications/";

const Home = ({ type }) => {
  const [genre, setGenre] = useState(null);
  const { isLoading, setIsLoading } = useContext(AuthContext);
  const { lists, dispatch, isFetching } = useContext(ListContext);
  const {
    myMovieListInfo,
    setMyMovieListInfo,
    mySeriesListInfo,
    setMySeriesListInfo,
  } = useContext(UserContext);
  const { auth, setAuth } = useContext(AuthContext);
  const { notifications, setNotifications } = useContext(UserContext);
  const { setNotificationsCount } = useContext(UserContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1920);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    getRandomLists(type, genre, dispatch);
  }, [type, genre]);

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
        const { data } = await axios.get(
          `${GET_MY_SERIES_LIST_URL}${auth?.user?._id}`
        );

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

  const getMyNotificationsList = async () => {
    try {
      const { data } = await axios.get(
        `${GET_MY_NOTIFICATIONS_LIST}${auth?.user?._id}`
      );
      if (data) {
        setNotifications(data.myNotifications);

        const unReadNotificationsCount = data.myNotifications.filter(
          (notification) => !notification.isRead
        ).length;
        setNotificationsCount(unReadNotificationsCount);
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  useEffect(() => {
    getMyNotificationsList();
  }, [notifications.length]);

  return (
    <div className="home">
      {isLoading ? (
        <SplashScreen />
      ) : (
        <>
          {isFetching ? (
            <HomeSpinner />
          ) : (
            <>
              {" "}
              <Navbar />
              <Featured type={type} setGenre={setGenre} />
              {lists?.length > 0 &&
                lists.map((list) => {
                  if (list.type === "series") {
                    return <SeriesRow key={list._id} list={list} />;
                  } else {
                    return <MoviesRow key={list._id} list={list} />;
                  }
                })}
              {myMovieListInfo.content.length > 0 && (
                <div>
                  <MoviesRow list={myMovieListInfo} />
                </div>
              )}
              {mySeriesListInfo.content.length > 0 && (
                <div>
                  <SeriesRow list={mySeriesListInfo} />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
