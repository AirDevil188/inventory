const express = require("express");
const router = express.Router();

const game_controller = require("../controllers/gameController");
const publisher_controller = require("../controllers/publisherController");
const developer_controller = require("../controllers/developerController");
const platform_controller = require("../controllers/platformController");
const genre_controller = require("../controllers/genreController");
const gameinstance_controller = require("../controllers/gameInstanceController");
const publisher = require("../models/publisher");

router.get("/", game_controller.index);

router.get("/game/create", game_controller.game_form_get);

router.post("/game/create", game_controller.game_form_post);

router.get("/games", game_controller.list_games);

router.get(`/game/:id`, game_controller.game_detail);

router.get("/publisher/create", publisher_controller.publisher_form_get);

router.post("/publisher/create", publisher_controller.publisher_form_post);

router.get("/publisher/:id", publisher_controller.publisher_detail);

router.get("/publishers", publisher_controller.list_publishers);

router.get("/developers", developer_controller.list_developers);

router.get("/developer/:id", developer_controller.developer_detail);

router.get("/platforms", platform_controller.list_platforms);

router.get("/platform/:id", platform_controller.platform_detail);

router.post("/genre/create", genre_controller.genre_form_post);

router.get("/genre/create", genre_controller.genre_form_get);

router.post("/genre/:id/delete", genre_controller.genre_delete_post);

router.get("/genre/:id/delete", genre_controller.genre_delete_get);

router.get("/genres", genre_controller.list_genres);

router.get("/genre/:id", genre_controller.genre_detail);

router.post(
  "/gameinstance/create",
  gameinstance_controller.gameinstance_form_post
);
router.get(
  "/gameinstance/create",
  gameinstance_controller.gameinstance_form_get
);

router.get("/gameinstances", gameinstance_controller.list_gameinstances);

router.get("/gameinstance/:id", gameinstance_controller.gameinstance_detail);

module.exports = router;
