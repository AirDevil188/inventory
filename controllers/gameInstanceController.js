const GameInstance = require("../models/gameinstance");
const Game = require("../models/game");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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

exports.gameinstance_create_form_get = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find().sort({ title: 1 }).exec();
  res.render("gameinstance_form", {
    title: "Create Gameinstance",
    list_games: allGames,
  });
});

exports.gameinstance_create_form_post = [
  body("gameinstance_platform", "Platform must not be empty.").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [allGames] = await Game.find().sort({ title: 1 }).exec();
    const gameinstance = new GameInstance({
      game: req.body.gameinstance_game,
      platform: req.body.gameinstance_platform,
      status: req.body.gameinstance_status,
    });

    if (!errors.isEmpty()) {
      res.render("gameinstance_form", {
        title: "Create Gameinstance",
        list_games: allGames,
      });
      return;
    } else {
      await gameinstance.save();
      res.redirect("/catalog/gameinstances");
    }
  }),
];
