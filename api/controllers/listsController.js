const List = require("../models/List");
const Movie = require("../models/Movie");
const TvShow = require("../models/TvShow");

module.exports = {
  createList: async (req, res) => {
    if (req.user.isAdmin) {
      const newList = new List(req.body);
      const savedList = await newList.save();
      let content;
      try {
        if (req.body.type === "series") {
          savedList.content.forEach(async (movieId) => {
            content = await TvShow.findByIdAndUpdate(
              movieId,
              { $push: { listIds: savedList._id } },
              { new: true }
            );
          });
        } else {
          savedList.content.forEach(async (movieId) => {
            content = await Movie.findByIdAndUpdate(
              movieId,
              { $push: { listIds: savedList._id } },
              { new: true }
            );
          });
        }
        res.status(201).send(savedList);
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      res.status(403).send({ message: "You are not allowed" });
    }
  },

  deleteList: async (req, res) => {
    if (req.user.isAdmin) {
      const { id } = req.params;

      try {
        await Movie.updateMany({ listIds: id }, { $pull: { listIds: id } });
        await List.findByIdAndDelete(id);
        res.status(201).send("The list has been deleted");
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      res.status(403).send({ message: "You are not allowed" });
    }
  },

  getList: async (req, res) => {
    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;
    let list = [];

    try {
      if (typeQuery) {
        if (genreQuery && genreQuery !== "Genre") {
          list = await List.aggregate([
            { $sample: { size: 10 } },
            { $match: { type: typeQuery, genre: genreQuery } },
          ]);
        } else {
          list = await List.aggregate([
            { $sample: { size: 10 } },
            { $match: { type: typeQuery } },
          ]);
        }
      } else {
        list = await List.aggregate([{ $sample: { size: 10 } }]);
      }

      res.status(200).send(list);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  getOneList: async (req, res) => {
    if (req.user.isAdmin) {
      const { id } = req.params;

      try {
        const list = await List.findById(id);

        res.status(200).send(list);
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      res.status(403).send({ message: "You are not allowed" });
    }
  },

  updateList: async (req, res) => {
    if (req.user.isAdmin) {
      const { id } = req.params;
      try {
        const listId = req.params.id;
        const newContent = req.body.content;
        const list = await List.findById(listId);
        const originalContent = list.content;

        // Get the new content to be added to the list
        const contentToAdd = newContent.filter(
          (item) => !originalContent.includes(item)
        );

        // Update the list with the new content using $addToSet operator
        const updatedList = await List.findByIdAndUpdate(
          listId,
          { $addToSet: { content: { $each: contentToAdd } } },
          { new: true }
        );

        req.body.content.forEach(async (movieId) => {
          const movie = await Movie.findById(movieId);
          if (!movie.listIds.includes(id)) {
            movie.listIds.push(id);
            const savedMovie = await movie.save();
          }
        });

        res.status(200).send(updatedList);
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      res.status(403).send({ message: "You are not allowed" });
    }
  },
};
