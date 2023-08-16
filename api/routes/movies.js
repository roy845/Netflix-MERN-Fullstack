const express = require("express");
const router = express.Router();

const {
  createMovie,
  updateMovie,
  deleteMovie,
  getMovie,
  getRandomMovie,
  getAllMovies,
  getSeries,
  getAllSeries,
  getEpisode,
  getAllEpisodes,
  getNextEpisode,
  getAllMedia,
  createNewSeason,
  createNewEpisode,
} = require("../controllers/moviesController");
const { verifyToken } = require("../middlewares/authMiddleware");

//CREATE
router.post("/", verifyToken, createMovie);
//UPDATE
router.put("/:id", verifyToken, updateMovie);
//DELETE
router.delete("/:id/:uId", verifyToken, deleteMovie);
//GET MOVIE
router.get("/find/:id", verifyToken, getMovie);
//GET Series
router.get("/find/series/:id", verifyToken, getSeries);
//GET RANDOM MOVIE
router.get("/random", verifyToken, getRandomMovie);
//GET ALL MOVIES
router.get("/", verifyToken, getAllMovies);
//GET ALL MEDIA
router.get("/media", verifyToken, getAllMedia);
//GET ALL SERIES
router.get("/series", verifyToken, getAllSeries);
//GET EPISODE
router.get("/episode/:id", verifyToken, getEpisode);
//GET NEXT EPISODE
router.get("/nextEpisode/:id", verifyToken, getNextEpisode);
//GET ALL EPISODES
router.get("/episodes", verifyToken, getAllEpisodes);
//CREATE NEW EPISODE
router.post("/newEpisode", createNewEpisode);
//CREATE NEW SEASON
router.post("/newSeason", createNewSeason);

module.exports = router;
