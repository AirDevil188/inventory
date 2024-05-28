const express = require("express");
const router = express.Router();

const game_controller = require("../controllers/gameController");
const publisher_controller = require("../controllers/publisherController");
const developer_controller = require("../controllers/developerController");
const platform_controller = require("../controllers/platformController");
const genre_controller = require("../controllers/genreController");
const gameinstance_controller = require("../controllers/gameInstanceController");

router.get("/", game_controller.index);

router.get("/games", game_controller.list_games);

router.get(`/game/:id`, game_controller.game_detail);

router.get("/publishers", publisher_controller.list_publishers);

router.get("/publisher/:id", publisher_controller.publisher_detail);

router.get("/developers", developer_controller.list_developers);

router.get("/developer/:id", developer_controller.developer_detail);

router.get("/platforms", platform_controller.list_platforms);

router.get("/platform/:id", platform_controller.platform_detail);

router.get("/genres", genre_controller.list_genres);

router.get("/genre/:id", genre_controller.genre_detail);

router.get("/gameinstances", gameinstance_controller.list_gameinstances);

router.get("/gameinstance/:id", gameinstance_controller.gameinstance_detail);

module.exports = router;
