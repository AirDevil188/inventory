const GameInstance = require("../models/gameinstance");
const Game = require("../models/game");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

exports.list_gameinstances = asyncHandler(async (req, res, next) => {
  const allGameinstace = await GameInstance.find().populate("game").exec();

  res.render("list_gameinstances", {
    title: "List Gameinstances",
    gameinstance_list: allGameinstace,
  });
});

exports.gameinstance_detail = asyncHandler(async (req, res, next) => {
  const gameinstance = await GameInstance.findById(req.params.id)
    .populate("game")
    .exec();

  if (gameinstance === null) {
    const err = new Error("Gameinstance was not found");
    err.status = 404;
    return next(err);
  }

  res.render("gameinstance_detail", {
    title: `Gameinstace copy: ` + gameinstance.game.title,
    gameinstance: gameinstance,
  });
});

exports.gameinstance_form_get = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find().sort({ title: 1 }).exec();
  res.render("gameinstance_form", {
    title: "Create Gameinstance",
    list_games: allGames,
  });
});

exports.gameinstance_form_post = [
  body("gameinstance_platform", "Platform must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [allGames] = await Game.find().sort({ title: 1 }).exec();
    const gameinstance = new GameInstance({
      game: req.body.gameinstance_game,
      platform: req.body.gameinstance_platform,
      status: req.body.gameinstance_status,
      due_back: req.body.gameinstance_due_back,
    });

    if (!errors.isEmpty()) {
      res.render("gameinstance_form", {
        title: "Create Gameinstance",
        list_games: allGames,
        gameinstance: gameinstance,
      });
      return;
    } else {
      await gameinstance.save();
      res.redirect("/catalog/gameinstances");
    }
  }),
];

exports.gameinstance_delete_get = asyncHandler(async (req, res, next) => {
  const gameinstance = await GameInstance.findById(req.params.id).exec();

  if (gameinstance === null) {
    const err = new Error("Gameinstance was not found.");
    err.status = 404;
    return next(err);
  }

  res.render("gameinstance_delete", {
    title: "Delete Gameinstance",
    gameinstance: gameinstance,
  });
});

exports.gameinstance_delete_post = asyncHandler(async (req, res, next) => {
  await GameInstance.findByIdAndDelete(req.body.gameinstance_id);
  res.redirect("/catalog/gameinstances");
});

exports.gameinstance_update_get = asyncHandler(async (req, res, next) => {
  const [gameinstance, allGames] = await Promise.all([
    GameInstance.findById(req.params.id).populate("game").exec(),
    Game.find().sort({ title: 1 }).exec(),
  ]);

  if (gameinstance === null) {
    const err = new Error("Gameinstance was not found.");
    err.status = 404;
    return next(err);
  }

  res.render("gameinstance_form", {
    title: "Update GameInstance",
    gameinstance: gameinstance,
    list_games: allGames,
  });
});

exports.gameinstance_update_post = [
  body("gameinstance_platform", "Platform must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("master_password", "Incorrect password")
    .matches(process.env.MASTER_PASSWORD)
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const gameinstance = new GameInstance({
      game: req.body.gameinstance_game,
      platform: req.body.gameinstance_platform,
      status: req.body.gameinstance_status,
      due_back: req.body.gameinstance_due_back,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allGames = await Game.find().sort({ title: 1 }).exec();

      res.render("gameinstance_form", {
        title: "Update GameInstance",
        gameinstance: gameinstance,
        list_games: allGames,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedGameInstance = await GameInstance.findByIdAndUpdate(
        req.params.id,
        gameinstance,
        {}
      );
      res.redirect(updatedGameInstance.url);
    }
  }),
];
