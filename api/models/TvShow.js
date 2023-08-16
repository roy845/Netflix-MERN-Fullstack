const mongoose = require("mongoose");

const TvShowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    //Cover Image
    img: {
      type: String,
      required: true,
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
    seasons: [
      {
        number: {
          type: Number,
          required: true,
        },
        episodes: [
          {
            title: {
              type: String,
              required: true,
              default: "",
            },
            description: {
              type: String,
              default: "",
            },
            duration: {
              type: Number,
              default: "",
            },
            video: {
              type: String,
              required: true,
              default: "",
            },
            subtitles: {
              type: String,
              default: "",
            },
            thumbnail: {
              type: String,
              default: "",
            },
          },
        ],
      },
    ],
    year: {
      type: Number,
      required: true,
    },
    limit: {
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
    directors: {
      type: Array,
    },
    actors: [
      {
        name: {
          type: String,
          required: true,
        },
        image: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("TvShow", TvShowSchema);
