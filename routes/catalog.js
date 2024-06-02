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

router.get("/game/:id/delete", game_controller.game_delete_get);

router.post("/game/:id/delete", game_controller.game_delete_post);

router.get("/game/:id/update", game_controller.game_update_get);

router.post("/game/:id/update", game_controller.game_update_post);

router.get("/games", game_controller.list_games);

router.get(`/game/:id`, game_controller.game_detail);

router.get("/publisher/create", publisher_controller.publisher_form_get);

router.post("/publisher/create", publisher_controller.publisher_form_post);

router.get("/publisher/:id/delete", publisher_controller.publisher_delete_get);

router.post(
  "/publisher/:id/delete",
  publisher_controller.publisher_delete_post
);

router.get("/publisher/:id/update", publisher_controller.publisher_update_get);

router.post(
  "/publisher/:id/update",
  publisher_controller.publisher_update_post
);

router.get("/publisher/:id", publisher_controller.publisher_detail);

router.get("/publishers", publisher_controller.list_publishers);

router.get("/developer/create", developer_controller.developer_form_get);

router.post("/developer/create", developer_controller.developer_form_post);

router.get("/developer/:id/delete", developer_controller.developer_delete_get);

router.post(
  "/developer/:id/delete",
  developer_controller.developer_delete_post
);

router.get("/developer/:id/update", developer_controller.developer_update_get);

router.post(
  "/developer/:id/update",
  developer_controller.developer_update_post
);

router.get("/developer/:id", developer_controller.developer_detail);

router.get("/developers", developer_controller.list_developers);

router.get("/platform/create", platform_controller.platform_form_get);

router.post("/platform/create", platform_controller.platform_form_post);

router.get("/platform/:id/delete", platform_controller.platform_delete_get);

router.post("/platform/:id/delete", platform_controller.platform_delete_post);

router.get("/platform/:id/update", platform_controller.platform_update_get);

router.post("/platform/:id/update", platform_controller.platform_update_post);

router.get("/platforms", platform_controller.list_platforms);

router.get("/platform/:id", platform_controller.platform_detail);

router.post("/genre/create", genre_controller.genre_form_post);

router.get("/genre/create", genre_controller.genre_form_get);

router.post("/genre/:id/delete", genre_controller.genre_delete_post);

router.get("/genre/:id/delete", genre_controller.genre_delete_get);

router.get("/genre/:id/update", genre_controller.genre_update_get);

router.post("/genre/:id/update", genre_controller.genre_update_post);

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

router.get(
  "/gameinstance/:id/delete",
  gameinstance_controller.gameinstance_delete_get
);

router.post(
  "/gameinstance/:id/delete",
  gameinstance_controller.gameinstance_delete_post
);

router.get(
  "/gameinstance/:id/update",
  gameinstance_controller.gameinstance_update_get
);

router.post(
  "/gameinstance/:id/update",
  gameinstance_controller.gameinstance_update_post
);
router.get("/gameinstances", gameinstance_controller.list_gameinstances);

router.get("/gameinstance/:id", gameinstance_controller.gameinstance_detail);

module.exports = router;
