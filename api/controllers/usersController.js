const User = require("../models/User");
const { hashPassword } = require("../helpers/authHelper");
const fs = require("fs");

module.exports = {
  updateUser: async (req, res) => {
    const { id } = req.params;

    if (req.user.id === id || req.user.isAdmin) {
      if (req.body.password) {
        req.body.password = hashPassword(req.body.password);
      }

      try {
        const updatedUser = await User.findByIdAndUpdate(
          id,
          {
            $set: req.body,
          },
          { new: true }
        );

        res.status(200).send({ message: "User is updated" });
      } catch (error) {
        res.status(500).send({ message: error });
      }
    } else {
      res.status(403).send({ message: "You can update only your account" });
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;

    if (req.user.id === id || req.user.isAdmin) {
      try {
        await User.findByIdAndDelete(id);

        res.status(200).send({ message: "User is deleted" });
      } catch (error) {
        res.status(500).send({ message: error });
      }
    } else {
      res.status(403).send({ message: "You can delete only your account" });
    }
  },

  getUser: async (req, res) => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      const { id } = req.params;

      try {
        const user = await User.findById(id);

        const { password, ...userInfo } = user._doc;

        res.status(200).send(userInfo);
      } catch (error) {
        res.status(500).send({ message: error, message1: "User not found" });
      }
    } else {
      res.status(403).send("You can only access to your profile");
    }
  },

  getAllUsers: async (req, res) => {
    const query = req.query.new;

    if (req.user.isAdmin) {
      try {
        const users = query
          ? await User.find().sort({ id: -1 }).limit(5)
          : await User.find();

        res.status(200).send(users);
      } catch (error) {
        res.status(500).send({ message: error });
      }
    } else {
      res.status(403).send("You are not allowed to see all users");
    }
  },

  getAllUsersProfiles: async (req, res) => {
    try {
      const users = await User.find({ username: { $ne: "admin" } });
      res.send(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
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

  getMovieLikes: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ movieRatings: user.movieRatings });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateMovieLikes: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { movieRatings: req.body },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.send(user.movieRatings);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateMyMovieList: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { myListOfMovies: req.body },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.send(user.myListOfMovies);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateMySeriesList: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByIdAndUpdate(
        id,
        { myListOfSeries: req.body },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.send(user.myListOfSeries);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getMyMoviesList: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const myList = user.myListOfMovies || [];
      res.send(myList);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getMySeriesList: async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const myList = user.myListOfSeries || [];
      res.send(myList);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  addToMyListMovies: async (req, res) => {
    const { id } = req.params;
    const { listTitle, movieId } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.myListOfMovies.title === null) {
        await User.updateOne(
          { _id: id },
          { $set: { "myListOfMovies.title": listTitle } }
        );
      }

      await User.updateOne(
        { _id: id },
        {
          $push: {
            "myListOfMovies.content": movieId,
          },
          $set: { [`myListOfMovies.isAdded.${movieId}`]: true },
        },
        { new: true }
      );

      const updatedUser = await User.findById(id).select("myListOfMovies");
      res.send(updatedUser.myListOfMovies);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  addToMyListSeries: async (req, res) => {
    const { id } = req.params;
    const { listTitle, seriesId } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.myListOfSeries.title === null) {
        await User.updateOne(
          { _id: id },
          { $set: { "myListOfSeries.title": listTitle } }
        );
      }

      await User.updateOne(
        { _id: id },
        {
          $push: {
            "myListOfSeries.content": seriesId,
          },

          $set: { [`myListOfSeries.isAdded.${seriesId}`]: true },
        },
        { new: true }
      );

      const updatedUser = await User.findById(id).select("myListOfSeries");

      res.send(updatedUser.myListOfSeries);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  removeFromMyListMovies: async (req, res) => {
    const { id, movieId } = req.params;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user's myListOfMovies.content array to remove the specified movieId
      await User.findByIdAndUpdate(id, {
        $pull: {
          "myListOfMovies.content": movieId,
        },
      });

      // Check if the myListOfMovies.content array is now empty and update the title accordingly
      const updatedUser = await User.findById(id);
      if (updatedUser.myListOfMovies.content.length === 0) {
        await User.findByIdAndUpdate(id, { "myListOfMovies.title": null });
      }

      // Set the isAdded property for the specified movieId to false
      await User.findByIdAndUpdate(
        id,
        {
          $set: { [`myListOfMovies.isAdded.${movieId}`]: false },
        },
        { new: true }
      );

      // Retrieve and send the updated user object
      const finalUser = await User.findById(id);
      res.send(finalUser.myListOfMovies);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  removeFromMyListSeries: async (req, res) => {
    const { id, seriesId } = req.params;

    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Update the user's myListOfMovies.content array to remove the specified movieId
      await User.findByIdAndUpdate(
        id,
        {
          $pull: {
            "myListOfSeries.content": seriesId,
          },
        },
        { new: true }
      );

      // Check if the myListOfMovies.content array is now empty and update the title accordingly
      const updatedUser = await User.findById(id);
      if (updatedUser.myListOfSeries.content.length === 0) {
        await User.findByIdAndUpdate(id, { "myListOfSeries.title": null });
      }

      // Set the isAdded property for the specified movieId to false
      await User.findByIdAndUpdate(id, {
        $set: { [`myListOfSeries.isAdded.${seriesId}`]: false },
      });

      // Retrieve and send the updated user object
      const finalUser = await User.findById(id);
      res.send(finalUser.myListOfSeries);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getUserPhoto: async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await User.findById(uid).select("profilePic");

      if (user.profilePic.data) {
        res.set("Content-type", user.profilePic.contentType);
        return res.status(200).send(user.profilePic.data);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        error,
      });
    }
  },
  updateUserProfile: async (req, res) => {
    if (req.user.id === req.params.uid || req.user.isAdmin) {
      try {
        const { username, email } = req.fields;
        const { photo } = req.files;
        const { uid } = req.params;

        const user = await User.findById(uid);
        const hashedPassword = req.fields.password
          ? await hashPassword(req.fields.password)
          : undefined;
        const updatedUser = await User.findByIdAndUpdate(
          uid,
          {
            username: username || user.name,
            password: hashedPassword || user.password,
            email: email || user.email,
          },
          { new: true }
        );

        if (photo) {
          updatedUser.profilePic.data = await fs.promises.readFile(photo.path);
          updatedUser.profilePic.contentType = photo.type;
        }

        await updatedUser.save();

        const { password, ...userInfo } = updatedUser._doc;
        res.status(200).send({
          message: "Profile Updated Successfully",
          userInfo,
        });
      } catch (error) {
        console.log(error);
        res.status(500).send({
          error,
          message: "Error in Update user profile",
        });
      }
    } else {
      res.status(403).send("You can update only your account!");
    }
  },

  getMyNotificationsList: async (req, res) => {
    try {
      const { uid } = req.params;

      const user = await User.findById(uid);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      const myNotifications = user.myNotifications;

      res.status(200).send({ myNotifications });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  removeNotificationFromMyList: async (req, res) => {
    try {
      const { uid, notificationId } = req.params;
      console.log(uid, notificationId);

      const user = await User.findOneAndUpdate(
        { _id: uid },
        { $pull: { myNotifications: { _id: notificationId } } },
        { new: true }
      );

      res.status(200).send({
        myNotifications: user.myNotifications,
        message: "Notification removed successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  deleteAllNotifications: async (req, res) => {
    try {
      const { uid } = req.params;

      const user = await User.findById(uid);

      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      user.myNotifications = [];

      await user.save();

      res.status(200).send({
        message: "All notifications deleted successfully",
        myNotifications: user.myNotifications,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  toggleMarkAsRead: async (req, res) => {
    try {
      const { uid, notificationId } = req.params;
      console.log(req.params);

      const updatedUser = await User.findOneAndUpdate(
        { _id: uid, "myNotifications._id": notificationId },
        { $set: { "myNotifications.$.isRead": true } },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .send({ message: "User or notification not found" });
      }

      res.status(200).send({
        message: "Notification marked as read",
        myNotifications: updatedUser.myNotifications,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  toggleMarkAsUnRead: async (req, res) => {
    try {
      const { uid, notificationId } = req.params;
      console.log(req.params);

      const updatedUser = await User.findOneAndUpdate(
        { _id: uid, "myNotifications._id": notificationId },
        { $set: { "myNotifications.$.isRead": false } },
        { new: true }
      );

      if (!updatedUser) {
        return res
          .status(404)
          .send({ message: "User or notification not found" });
      }

      res.status(200).send({
        message: "Notification marked as unread",
        myNotifications: updatedUser.myNotifications,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  },

  createNotification: async (req, res) => {
    const { message } = req.body; // assuming the message and date are passed in the request body

    try {
      // create the notification object
      const notification = {
        message,
        isRead: false,
      };

      const filter = { isNotificationsEnabled: true }; // select all documents that the isNotifications field is true aka enabled
      const update = { $push: { myNotifications: notification } };
      const options = { multi: true }; // update all matching documents

      await User.updateMany(filter, update, options, (err, result) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`${result.nModified} documents updated`);
        }
      });

      res.status(200).json({
        success: true,
        message: "Notification created successfully.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error." });
    }
  },

  updateNotificationsStatus: async (req, res) => {
    const { uid } = req.params;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: uid },
        { isNotificationsEnabled: req.body.on },
        { new: true }
      );

      console.log(req.body.on);
      console.log(updatedUser.isNotificationsEnabled);

      res.status(200).send("User Notifications Updated");
    } catch (error) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error." });
    }
  },

  getNotificationsStatus: async (req, res) => {
    const { uid } = req.params;
    console.log(uid);

    try {
      const user = await User.findById({ _id: uid });
      console.log(user.isNotificationsEnabled);
      res.status(200).send(user.isNotificationsEnabled);
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error." });
    }
  },

  saveLastWatchPosition: async (req, res) => {
    const { lastWatchPosition } = req.body;
    const { uid, movieId } = req.params;

    console.log(lastWatchPosition);

    console.log(uid);
    console.log(movieId);

    try {
      // Find the user by ID
      const user = await User.findById(uid);

      // Check if the movie already exists in the lastWatchedPositions array
      const movieIndex = user.lastWatchedPositions.findIndex(
        (pos) => pos.movie.toString() === movieId
      );

      // If the movie is already in the array, update the lastWatchedPosition
      if (movieIndex !== -1) {
        user.lastWatchedPositions[movieIndex].lastWatchedPosition =
          lastWatchPosition;
      }
      // If the movie is not in the array, add it with the lastWatchedPosition
      else {
        user.lastWatchedPositions.push({
          movie: movieId,
          lastWatchedPosition: lastWatchPosition,
        });
      }

      // Save the updated user document
      await user.save();

      // Send a response to the client
      res
        .status(200)
        .json({ message: "Last watched position saved successfully." });
    } catch (error) {
      // Handle any errors that occurred during the update
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },

  getLastWatchPosition: async (req, res) => {
    const { uid, movieId } = req.params;

    try {
      // Find the user by ID
      const user = await User.findById(uid);

      // Find the movie index in the lastWatchedPositions array
      const movieIndex = user.lastWatchedPositions.findIndex(
        (pos) => pos.movie.toString() === movieId
      );

      // If the movie is not found, return a 404 status code
      if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie not found." });
      }

      // Return the last watched position for the movie
      res.status(200).json({
        lastWatchPosition:
          user.lastWatchedPositions[movieIndex].lastWatchedPosition,
      });
    } catch (error) {
      // Handle any errors that occurred during the query
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },

  deleteLastWatchPosition: async (req, res) => {
    const { uid, movieId } = req.params;

    try {
      // Find the user by ID
      const user = await User.findById(uid);

      // Find the movie index in the lastWatchedPositions array
      const movieIndex = user.lastWatchedPositions.findIndex(
        (pos) => pos.movie.toString() === movieId
      );

      // If the movie is not found, return a 404 status code
      if (movieIndex === -1) {
        return res.status(404).json({ message: "Movie not found." });
      }

      // Delete the last watch position from the array
      user.lastWatchedPositions.splice(movieIndex, 1);

      // Save the updated user object
      await user.save();

      // Return the last watched position for the movie
      res
        .status(200)
        .json({ message: "Last watch position deleted successfully." });
    } catch (error) {
      // Handle any errors that occurred during the query
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },

  saveLastWatchPositionEpisode: async (req, res) => {
    const { lastWatchPosition, duration } = req.body;
    const { uid, episodeId, seasonNumber } = req.params;

    console.log(duration);

    try {
      // Find the user by ID
      const user = await User.findById(uid);

      // Check if the movie already exists in the lastWatchedPositions array
      const episodeIndex = user.lastWatchedPositionsEpisodes.findIndex(
        (pos) => pos.episodeId.toString() === episodeId
      );

      // If the movie is already in the array, update the lastWatchedPosition
      if (episodeIndex !== -1) {
        user.lastWatchedPositionsEpisodes[episodeIndex].lastWatchedPosition =
          lastWatchPosition;
      }
      // If the movie is not in the array, add it with the lastWatchedPosition
      else {
        user.lastWatchedPositionsEpisodes.push({
          episodeId: episodeId,
          seasonNumber: seasonNumber,
          duration: duration,
          lastWatchedPosition: lastWatchPosition,
        });
      }

      // Save the updated user document
      await user.save();

      // Send a response to the client
      res
        .status(200)
        .json({ message: "Last watched position saved successfully." });
    } catch (error) {
      // Handle any errors that occurred during the update
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },

  getLastWatchPositionEpisode: async (req, res) => {
    const { uid, episodeId } = req.params;

    try {
      // Find the user by ID
      const user = await User.findById(uid);

      // Find the movie index in the lastWatchedPositions array
      const episodeIndex = user.lastWatchedPositionsEpisodes.findIndex(
        (pos) => pos.episodeId.toString() === episodeId
      );

      // If the movie is not found, return a 404 status code
      if (episodeIndex === -1) {
        return res.status(404).json({ message: "Episode not found." });
      }

      // Return the last watched position for the movie
      res.status(200).json({
        lastWatchPosition:
          user.lastWatchedPositionsEpisodes[episodeIndex].lastWatchedPosition,
      });
    } catch (error) {
      // Handle any errors that occurred during the query
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
  deleteLastWatchPositionEpisode: async (req, res) => {
    const { uid, episodeId } = req.params;
    console.log("hi");
    try {
      // Find the user by ID
      const user = await User.findById(uid);

      // Find the episode index in the lastWatchedPositionsEpisodes array
      const episodeIndex = user.lastWatchedPositionsEpisodes.findIndex(
        (pos) => pos.episodeId.toString() === episodeId
      );

      // If the episode is not found, return a 404 status code
      if (episodeIndex === -1) {
        return res.status(404).json({ message: "Episode not found." });
      }

      // Remove the episode from the lastWatchedPositionsEpisodes array
      user.lastWatchedPositionsEpisodes.splice(episodeIndex, 1);

      // Save the updated user object
      await user.save();

      res.status(200).json({
        message: "Last watch position deleted successfully.",
        lastWatchedPositionsEpisodes: user.lastWatchedPositionsEpisodes,
      });
    } catch (error) {
      // Handle any errors that occurred during the query
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
  getAllLastWatchPositionEpisodes: async (req, res) => {
    const { uid } = req.params;

    try {
      // Find the user by ID
      const user = await User.findById(uid);

      // Return the last watched position for the movie
      res.status(200).json({
        lastWatchPositions: user.lastWatchedPositionsEpisodes,
      });
    } catch (error) {
      // Handle any errors that occurred during the query
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },

  updateTimeSpentWatchingMovies: async (req, res) => {
    const { uid } = req.params;
    const { date, timeSpent } = req.body;
    try {
      const user = await User.findById(uid);

      const timeEntryIndex = user.timeSpentWatchingMovies.findIndex(
        (entry) => entry.date === date
      );

      if (timeEntryIndex !== -1) {
        // Update the time spent for the existing date
        await User.updateOne(
          { _id: uid, "timeSpentWatchingMovies.date": date },
          { $inc: { "timeSpentWatchingMovies.$.timeSpent": timeSpent } }
        );
      } else {
        // Add a new time entry for the date
        await User.updateOne(
          { _id: uid },
          { $push: { timeSpentWatchingMovies: { date, timeSpent } } }
        );
      }

      res.status(200).json({ message: "Time spent updated successfully." });
    } catch (error) {
      // Handle any errors that occurred during the query
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
  getTimeSpentWatchingMovies: async (req, res) => {
    const { uid } = req.params;
    try {
      const user = await User.findById(uid);
      const timeSpentWatchingMovies = user.timeSpentWatchingMovies;

      res.status(200).json({ timeSpentWatchingMovies });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },

  updateTimeSpentWatchingSeries: async (req, res) => {
    const { uid } = req.params;
    const { date, timeSpent } = req.body;
    try {
      const user = await User.findById(uid);

      const timeEntryIndex = user.timeSpentWatchingSeries.findIndex(
        (entry) => entry.date === date
      );

      if (timeEntryIndex !== -1) {
        // Update the time spent for the existing date
        await User.updateOne(
          { _id: uid, "timeSpentWatchingSeries.date": date },
          { $inc: { "timeSpentWatchingSeries.$.timeSpent": timeSpent } }
        );
      } else {
        // Add a new time entry for the date
        await User.updateOne(
          { _id: uid },
          { $push: { timeSpentWatchingSeries: { date, timeSpent } } }
        );
      }

      res.status(200).json({ message: "Time spent updated successfully." });
    } catch (error) {
      // Handle any errors that occurred during the query
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
  getTimeSpentWatchingSeries: async (req, res) => {
    const { uid } = req.params;
    try {
      const user = await User.findById(uid);
      const timeSpentWatchingSeries = user.timeSpentWatchingSeries;

      res.status(200).json({ timeSpentWatchingSeries });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error." });
    }
  },
};
