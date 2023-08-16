const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  like: { type: Boolean, default: false },
  dislike: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
});

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  date: { type: Date, default: Date.now },
  image: { type: String, default: "" },
  movie: { type: String, default: "" },
  isRead: { type: Boolean, required: true },
  isSeries: { type: Boolean },
});

const timeSpentWatchingMovies = new mongoose.Schema({
  date: { type: String, required: true, default: "" },
  timeSpent: { type: Number, required: true, default: 0 },
});

const timeSpentWatchingSeries = new mongoose.Schema({
  date: { type: String, required: true, default: "" },
  timeSpent: { type: Number, required: true, default: 0 },
});

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    movieRatings: {
      type: Object,
      of: ratingSchema,
      default: {
        like: { type: Boolean, default: false },
        dislike: { type: Boolean, default: false },
        rating: { type: Number, default: 0 },
      },
    },
    profilePic: {
      type: {
        data: Buffer,
        contentType: String,
      },
      default: { data: Buffer.from(""), contentType: "image/*" },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    myListOfMovies: {
      title: {
        type: String,
        default: "My Movies List",
      },
      content: {
        type: Array,
        default: [],
      },

      isAdded: {
        type: Map,
        of: Boolean,
        default: new Map(),
      },
    },
    myListOfSeries: {
      title: {
        type: String,
        default: "My Series List",
      },
      content: {
        type: Array,
        default: [],
      },
      isAdded: {
        type: Map,
        of: Boolean,
        default: new Map(),
      },
    },
    myNotifications: {
      type: [notificationSchema],
      default: [
        {
          message: "Welcome to Netflix",
          isRead: false,
          image: "",
          movie: "",
        },
      ],
    },
    isNotificationsEnabled: {
      type: Boolean,
      default: false,
    },
    resetTokenDetails: {
      email: {
        type: String,
        default: "",
      },
      token: {
        type: String,
        default: "",
      },
      expiresAt: {
        type: String,
        default: "",
      },
    },
    lastWatchedPositions: [
      {
        movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie" },
        lastWatchedPosition: { type: Number, double: true, default: 0 },
      },
    ],
    lastWatchedPositionsEpisodes: [
      {
        episodeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TvShow.seasons.episodes._id",
        },
        seasonNumber: { type: Number, default: 1 },
        lastWatchedPosition: { type: Number, double: true, default: 0 },
        duration: { type: Number },
      },
    ],
    timeSpentWatchingMovies: [timeSpentWatchingMovies],
    timeSpentWatchingSeries: [timeSpentWatchingSeries],
    isConnected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
