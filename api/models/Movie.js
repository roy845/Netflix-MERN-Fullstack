const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    img: {
      type: String,
    },
    imgTitle: {
      type: String,
    },
    imgSm: {
      type: String,
    },
    trailer: {
      type: String,
    },
    video: {
      type: String,
    },
    subtitles: {
      type: String,
    },
    year: {
      type: String,
    },
    limit: {
      type: Number,
    },
    duration: {
      type: Number,
    },
    genres: {
      type: Array,
    },
    isSeries: {
      type: Boolean,
      default: false,
    },
    listIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
    actors: {
      type: Array,
    },
    directors: {
      type: Array,
    },
  },
  { timeseries: true }
);

module.exports = mongoose.model("Movie", MovieSchema);
