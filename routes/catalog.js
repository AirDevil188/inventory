const express = require("express");
const router = express.Router();

const game_controller = require("../controllers/gameController");
const publisher_controller = require("../controllers/publisherController");
const developer_controller = require("../controllers/developerController");
const genre_controller = require("../controllers/genreController");

router.get("/", game_controller.index);

router.get("/games", game_controller.list_games);

router.get(`/game/:id`, game_controller.game_detail);

module.exports = router;
