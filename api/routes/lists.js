const express = require("express");
const router = express.Router();

const {
  createList,
  deleteList,
  updateList,
  getList,
  getOneList,
} = require("../controllers/listsController");
const { verifyToken } = require("../middlewares/authMiddleware");

//CREATE
router.post("/", verifyToken, createList);
//DELETE
router.delete("/:id", verifyToken, deleteList);
//UPDATE
router.put("/:id", verifyToken, updateList);
//GET
router.get("/", verifyToken, getList);
//GET
router.get("/:id", verifyToken, getOneList);

module.exports = router;
