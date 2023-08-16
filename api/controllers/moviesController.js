const Movie = require("../models/Movie");
const TvShow = require("../models/TvShow");
const List = require("../models/List");
const User = require("../models/User");
const fs = require("fs");

module.exports = {
  createMovie: async (req, res) => {
    let newMovie;
    if (req.user.isAdmin) {
      try {
        if (req.body.isSeries === "true") {
          newMovie = new TvShow(req.body);
          await newMovie.save();
        } else {
          newMovie = new Movie(req.body);
          await newMovie.save();
        }

        // const dateInDateFormat = new Date(new Date().toLocaleDateString());
        // const formattedDate = dateInDateFormat.toLocaleDateString("en-US", {
        //   year: "numeric",
        //   month: "long",
        //   day: "numeric",
        // });

        // create the new movie/series notification object
        const movieNotification = {
          message: `New ${newMovie.isSeries ? "Series" : "Movie"} added ${
            newMovie.title
          }`,
          image: newMovie.img,
          isSeries: newMovie.isSeries,
          movie: newMovie._id,
          date: Date.now(),
          isRead: false,
        };

        const filter = { isNotificationsEnabled: true }; // select all documents that the isNotifications field is true aka enabled
        const update = { $push: { myNotifications: movieNotification } };
        const options = { multi: true }; // update all matching documents

        await User.updateMany(filter, update, options, (err, result) => {
          if (err) {
            console.error(err);
          } else {
            console.log(`${result.nModified} documents updated`);
          }
        });

        res.status(201).send(newMovie);
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      res.status(403).send({ message: "You are not allowed" });
    }
  },

  updateMovie: async (req, res) => {
    if (req.user.isAdmin) {
      try {
        const { id } = req.params;

        const updatedMovie = await Movie.findByIdAndUpdate(id, req.body, {
          new: true,
        });

        res.status(200).send(updatedMovie);
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      res.status(403).send({ message: "You are not allowed" });
    }
  },

  deleteMovie: async (req, res) => {
    const { id, uId } = req.params;

    if (req.user.isAdmin) {
      try {
        await List.updateMany({}, { $pull: { content: id } });

        await Movie.findByIdAndDelete(id);
        await TvShow.findByIdAndDelete(id);

        // Delete empty lists
        const emptyLists = await List.find({ content: [] });
        emptyLists.forEach(async (list) => {
          await List.findByIdAndDelete(list._id);
        });

        // Remove movie from user's list
        await User.updateOne(
          { _id: uId },
          { $pull: { "myListOfMovies.content": id } }
        );

        // Remove series from user's list
        await User.updateOne(
          { _id: uId },
          { $pull: { "myListOfSeries.content": id } }
        );

        res.status(200).send({ message: "The movie has been deleted" });
      } catch (error) {
        res.status(500).send({ message: error });
      }
    } else {
      res.status(403).send({ message: "You are not allowed" });
    }
  },

  getMovie: async (req, res) => {
    const { id } = req.params;

    try {
      const movie = await Movie.findById(id);

      res.status(200).send(movie);
    } catch (error) {
      res.status(500).send({ message: error, message1: "Movie not found" });
    }
  },

  getSeries: async (req, res) => {
    const { id } = req.params;

    try {
      const series = await TvShow.findById(id);

      res.status(200).send(series);
    } catch (error) {
      res.status(500).send({ message: error, message1: "Series not found" });
    }
  },

  getRandomMovie: async (req, res) => {
    const type = req.query.type;
    console.log(type);
    let movie;
    try {
      if (type === "series") {
        movie = await TvShow.aggregate([
          { $match: { isSeries: true } },
          { $sample: { size: 1 } },
        ]);
      } else {
        movie = await Movie.aggregate([
          { $match: { isSeries: false } },
          { $sample: { size: 1 } },
        ]);
      }
      res.status(200).json(movie);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  getAllMovies: async (req, res) => {
    try {
      const movies = await Movie.find({});

      res.status(200).send(movies);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  },

  getAllSeries: async (req, res) => {
    try {
      const tvShows = await TvShow.find({});

      res.status(200).send(tvShows);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  },

  getAllMedia: async (req, res) => {
    try {
      const movies = await Movie.find({});
      const tvShows = await TvShow.find({});
      const allMedia = [...movies, ...tvShows];
      res.status(200).send(allMedia);
    } catch (error) {
      res.status(500).send({ message: error });
    }
  },

  getEpisode: async (req, res) => {
    try {
      const { id } = req.params;
      const episode = await TvShow.findOne(
        { "seasons.episodes._id": id },
        { "seasons.$": 1 }
      );
      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }
      const season = episode.seasons.find((s) =>
        s.episodes.some((e) => e._id.toString() === id)
      );
      if (!season) {
        return res.status(404).json({ message: "Season not found" });
      }
      const selectedEpisode = season.episodes.find(
        (e) => e._id.toString() === id
      );
      if (!selectedEpisode) {
        return res.status(404).json({ message: "Episode not found" });
      }
      res.status(200).json(selectedEpisode);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getNextEpisode: async (req, res) => {
    try {
      const { id } = req.params;
      const episode = await TvShow.findOne(
        { "seasons.episodes._id": id },
        { "seasons.$": 1 }
      );
      if (!episode) {
        return res.status(404).json({ message: "Episode not found" });
      }
      const season = episode.seasons.find((s) =>
        s.episodes.some((e) => e._id.toString() === id)
      );
      if (!season) {
        return res.status(404).json({ message: "Season not found" });
      }
      const episodeIndex = season.episodes.findIndex(
        (e) => e._id.toString() === id
      );
      if (episodeIndex === -1) {
        return res.status(404).json({ message: "Episode not found" });
      }
      const nextEpisode = season.episodes[episodeIndex + 1];
      if (!nextEpisode) {
        return res.status(404).json({ message: "Next episode not found" });
      }
      res.status(200).json({ id: nextEpisode._id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getAllEpisodes: async (req, res) => {
    try {
      const tvShows = await TvShow.find();
      const allEpisodes = [];

      tvShows.forEach((tvShow) => {
        tvShow.seasons.forEach((season) => {
          season.episodes.forEach((episode) => {
            allEpisodes.push(episode);
          });
        });
      });

      res.status(200).json(allEpisodes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  createNewEpisode: async (req, res) => {
    const { seriesId, seasonNumber, newEpisode } = req.body;

    try {
      // Find the TV show by its seriesId
      const tvShow = await TvShow.findById(seriesId);

      if (!tvShow) {
        return res.status(404).json({ error: "TV show not found" });
      }

      // Find the season based on the seasonNumber
      const season = tvShow.seasons.find(
        (s) => s.number === Number(seasonNumber)
      );

      if (!season) {
        return res.status(404).json({ error: "Season not found" });
      }

      // Add the new episode to the episodes array in the season
      season.episodes.push(newEpisode);

      // Save the updated TV show
      await tvShow.save();

      // create the new movie/series notification object
      const episodeNotification = {
        message: `Episode ${newEpisode.title} added to ${tvShow.title} on season ${seasonNumber}`,
        image: tvShow.imgSm,
        isSeries: true,
        movie: tvShow._id,
        date: Date.now(),
        isRead: false,
      };

      const filter = { isNotificationsEnabled: true }; // select all documents that the isNotifications field is true aka enabled
      const update = { $push: { myNotifications: episodeNotification } };
      const options = { multi: true }; // update all matching documents

      await User.updateMany(filter, update, options, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`${result.nModified} documents updated`);
        }
      });

      res.status(200).json({ message: "New episode added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createNewSeason: async (req, res) => {
    const { seriesId, newSeason } = req.body; // Assuming the series ID and new season object are passed in the request body
    console.log(seriesId, newSeason);
    try {
      const tvShow = await TvShow.findOneAndUpdate(
        { _id: seriesId }, // Find the TvShow document by ID
        { $push: { seasons: newSeason } }, // Push the new season object to the "seasons" array
        { new: true } // Return the updated TvShow document
      );

      if (!tvShow) {
        return res.status(404).json({ error: "TV show not found" });
      }

      // create the new movie/series notification object
      const seasonNotification = {
        message: `Season ${newSeason.number} added to ${tvShow.title}`,
        image: tvShow.imgSm,
        isSeries: true,
        movie: tvShow._id,
        date: Date.now(),
        isRead: false,
      };

      const filter = { isNotificationsEnabled: true }; // select all documents that the isNotifications field is true aka enabled
      const update = { $push: { myNotifications: seasonNotification } };
      const options = { multi: true }; // update all matching documents

      await User.updateMany(filter, update, options, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`${result.nModified} documents updated`);
        }
      });

      res.status(200).json({ message: "New season added successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getUsersStats: async (req, res) => {
    try {
      const today = new Date();
      const lastYear = today.setFullYear(today.setFullYear() - 1);
      const monthsArray = [];

      const data = await User.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);

      res.status(200).send(data);
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
