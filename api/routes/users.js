const express = require("express");
const router = express.Router();

const {
  updateUser,
  deleteUser,
  getUser,
  getAllUsers,
  getUsersStats,
  getMovieLikes,
  updateMovieLikes,
  addToMyListMovies,
  removeFromMyListMovies,
  addToMyListSeries,
  removeFromMyListSeries,
  getMyMoviesList,
  getMySeriesList,
  updateMyMovieList,
  updateMySeriesList,
  getAllUsersProfiles,
  getUserPhoto,
  updateUserProfile,
  getMyNotificationsList,
  removeNotificationFromMyList,
  deleteAllNotifications,
  toggleMarkAsRead,
  toggleMarkAsUnRead,
  createNotification,
  updateNotificationsStatus,
  getNotificationsStatus,
  saveLastWatchPosition,
  getLastWatchPosition,
  deleteLastWatchPosition,
  saveLastWatchPositionEpisode,
  getLastWatchPositionEpisode,
  getAllLastWatchPositionEpisodes,
  deleteLastWatchPositionEpisode,
  updateTimeSpentWatchingMovies,
  getTimeSpentWatchingMovies,
  updateTimeSpentWatchingSeries,
  getTimeSpentWatchingSeries,
} = require("../controllers/usersController");
const { verifyToken } = require("../middlewares/authMiddleware");
const formidable = require("express-formidable");

//UPDATE
router.put("/:id", verifyToken, updateUser);
//GET
router.get("/find/:id", verifyToken, getUser);
//DELETE
router.delete("/deleteUser/:id", verifyToken, deleteUser);
//GET ALL
router.get("/", verifyToken, getAllUsers);
//GET ALL USERS FOR PROFILES PAGE
router.get("/getAllUsers", getAllUsersProfiles);
//GET USER STATS
router.get("/stats", verifyToken, getUsersStats);
//GET USER MOVIE LIKES
router.get("/movieLikes/:id", verifyToken, getMovieLikes);
//UPDATE USER MOVIE LIKES
router.put("/movieLikes/:id", verifyToken, updateMovieLikes);
//POST ADD MOVIE TO MY LIST
router.post("/addToMyListMovies/:id", verifyToken, addToMyListMovies);
//POST ADD SERIES TO MY LIST
router.post("/addToMyListSeries/:id", verifyToken, addToMyListSeries);
//GET MY MOVIES LIST
router.get("/getMyMoviesList/:id", verifyToken, getMyMoviesList);
//GET MY SERIES LIST
router.get("/getMySeriesList/:id", verifyToken, getMySeriesList);
//DELETE MOVIE FROM MY LIST
router.delete(
  "/removeMyListMovies/:id/:movieId",
  verifyToken,
  removeFromMyListMovies
);
//DELETE SERIES FROM MY LIST
router.delete(
  "/removeMyListSeries/:id/:seriesId",
  verifyToken,
  removeFromMyListSeries
);
//UPDATE USER MYLIST MOVIES
router.put("/updateMyMovieList/:id", verifyToken, updateMyMovieList);
//UPDATE USER MYLIST SERIES
router.put("/updateMySeriesList/:id", verifyToken, updateMySeriesList);
//GET USER PROFILE PICTURE
router.get("/getUserPhoto/:uid", getUserPhoto);
//PUT UPDATE USER PROFILE
router.put(
  "/updateUserProfile/:uid",
  verifyToken,
  formidable(),
  updateUserProfile
);

router.get("/getMyNotifications/:uid", getMyNotificationsList);
router.delete(
  "/removeNotification/:uid/:notificationId",
  removeNotificationFromMyList
);
router.put("/toggleMarkAsRead/:uid/:notificationId", toggleMarkAsRead);
router.put("/toggleMarkAsUnRead/:uid/:notificationId", toggleMarkAsUnRead);
router.delete("/removeAllNotifications/:uid", deleteAllNotifications);

router.post("/createNotification", createNotification);
router.put("/updateNotificationsStatus/:uid", updateNotificationsStatus);
router.get("/getNotificationsStatus/:uid", getNotificationsStatus);
router.put("/saveLastWatchPosition/:uid/:movieId", saveLastWatchPosition);
router.get("/getLastWatchPosition/:uid/:movieId", getLastWatchPosition);
router.delete(
  "/deleteLastWatchPosition/:uid/:movieId",
  deleteLastWatchPosition
);
router.put(
  "/saveLastWatchPositionEpisode/:uid/:seasonNumber/:episodeId",
  saveLastWatchPositionEpisode
);
router.get(
  "/getLastWatchPositionEpisode/:uid/:episodeId",
  getLastWatchPositionEpisode
);

router.get(
  "/getAllLastWatchPositionEpisodes/:uid/",
  getAllLastWatchPositionEpisodes
);

router.delete(
  "/deleteLastWatchPositionEpisode/:uid/:episodeId",
  deleteLastWatchPositionEpisode
);

router.post(
  "/updateTimeSpentWatchingMovies/:uid",
  updateTimeSpentWatchingMovies
);
router.get("/getTimeSpentWatchingMovies/:uid", getTimeSpentWatchingMovies);
router.post(
  "/updateTimeSpentWatchingSeries/:uid",
  updateTimeSpentWatchingSeries
);
router.get("/getTimeSpentWatchingSeries/:uid", getTimeSpentWatchingSeries);

module.exports = router;
