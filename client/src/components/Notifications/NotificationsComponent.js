import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { toast } from "react-hot-toast";
import { AuthContext } from "../../context/authContext/AuthContext";
import DeleteIcon from "@material-ui/icons/Delete";
import MarkunreadIcon from "@material-ui/icons/Markunread";
import DraftsIcon from "@material-ui/icons/Drafts";
import axios from "axios";
import FancyBox from "../FancyBox/FancyBox";
import { UserContext } from "../../context/userContext/UserContext";
import Navbar from "../navbar/Navbar";
import NoNotifications from "../NoNotifications/NoNotifications";
import { CircularProgress } from "@material-ui/core";

const GET_MY_LIST_URL = "http://localhost:8800/api/users/getMyList/";
const GET_MY_NOTIFICATIONS_LIST =
  "http://localhost:8800/api/users/getMyNotifications/";
const REMOVE_NOTIFICATION =
  "http://localhost:8800/api/users/removeNotification/";
const TOGGLE_MARK_AS_READ = "http://localhost:8800/api/users/toggleMarkAsRead/";
const TOGGLE_MARK_AS_UNREAD =
  "http://localhost:8800/api/users/toggleMarkAsUnRead/";
const REMOVE_ALL_NOTIFICATIONS =
  "http://localhost:8800/api/users/removeAllNotifications/";

const NotificationsComponent = () => {
  const { auth, setAuth } = useContext(AuthContext);
  const { notifications, setNotifications } = useContext(UserContext);
  const { setNotificationsCount } = useContext(UserContext);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteAll, setIsDeleteAll] = useState(false);
  const { myListInfo, setMyListInfo } = useContext(UserContext);
  const [selectedItem, setSelectedItem] = useState(0);
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

  const handleDeleteOne = async (notificationId) => {
    setSelectedItem(notificationId);
    try {
      setIsDelete(true);
      const { data } = await axios.delete(
        `${REMOVE_NOTIFICATION}${auth?.user?._id}/${notificationId}`
      );
      setIsDelete(false);
      console.log(data);
      setNotifications(data.myNotifications);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleToggleMarkAsRead = async (notificationId) => {
    try {
      const { data } = await axios.put(
        `${TOGGLE_MARK_AS_READ}${auth?.user?._id}/${notificationId}`
      );
      if (data) {
        setNotifications(data.myNotifications);
        toast.success(data.message);
        setNotificationsCount((prev) => prev - 1);
        // getMyNotificationsList();
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleToggleMarkAsUnRead = async (notificationId) => {
    console.log(notificationId);
    try {
      const { data } = await axios.put(
        `${TOGGLE_MARK_AS_UNREAD}${auth?.user?._id}/${notificationId}`
      );
      if (data) {
        setNotifications(data.myNotifications);
        setNotificationsCount((prev) => prev + 1);
        toast.success(data.message);
        // getMyNotificationsList();
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      setIsDeleteAll(true);
      const { data } = await axios.delete(
        `${REMOVE_ALL_NOTIFICATIONS}${auth?.user?._id}`
      );
      setIsDeleteAll(false);
      console.log(data);
      setNotifications(data.myNotifications);
      toast.success(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error);
    }
  };

  const renderNotifications = notifications
    ?.sort((a, b) => new Date(b.date) - new Date(a.date))
    .reverse()
    .map((notification, _) => {
      const { _id, message, date, image, movie, isSeries } = notification;
      let { isRead } = notification;
      const dateInDateFormat = new Date(date);
      const formattedDate = dateInDateFormat.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      isRead = !isRead;
      console.log(notification);
      return (
        <FancyBox
          movie={movie}
          to={isSeries ? `/seriesInfo/${movie}` : `/movieInfo/${movie}`}
        >
          <div
            key={notification._id}
            style={{ cursor: "pointer" }}
            className="center"
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {isRead ? (
                <MarkunreadIcon
                  onDoubleClick={() => handleToggleMarkAsRead(_id)}
                  style={{ color: "gold" }}
                />
              ) : (
                <DraftsIcon
                  onDoubleClick={() => handleToggleMarkAsUnRead(_id)}
                  style={{ color: "gold", marginLeft: "10px" }}
                />
              )}
              {image && (
                <img
                  src={image}
                  style={{ marginLeft: "10px", marginRight: "10px" }}
                />
              )}
            </div>
            <div style={{ marginLeft: "10px", marginRight: "10px" }}>
              {message}
            </div>
            <div>{formattedDate}</div>
            {isDelete && selectedItem === _id ? (
              <CircularProgress style={{ color: "red" }} />
            ) : (
              <DeleteIcon
                style={{ color: "red", marginLeft: "5px" }}
                onClick={() => handleDeleteOne(_id)}
              />
            )}
          </div>
        </FancyBox>
      );
    });

  return (
    <>
      <Navbar />

      {notifications.length > 0 ? (
        <NotificationsContainer>
          <FancyBox>
            <div className="center">
              <HighlightOffIcon
                onClick={handleDeleteAll}
                style={{ color: "red", cursor: "pointer", marginRight: "10px" }}
              />
              <h2 style={{ color: "white", marginRight: "6rem" }}>
                Notifications
              </h2>
            </div>
          </FancyBox>
          {isDeleteAll ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "70vh",
              }}
            >
              <CircularProgress
                style={{
                  color: "red",
                }}
              />
            </div>
          ) : (
            renderNotifications
          )}
        </NotificationsContainer>
      ) : (
        <NoNotifications />
      )}
    </>
  );
};

const NotificationsContainer = styled.div`
  margin-top: 80px; /* Add marginTop to push the boxes down below the navbar */
`;

export default NotificationsComponent;
