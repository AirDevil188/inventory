const Game = require("../models/game");
const Publisher = require("../models/publisher");
const Developer = require("../models/developer");
const GameInstance = require("../models/gameinstance");

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

  res.render("gameinstance_detail", {
    title: `Gameinstace copy: ` + gameinstance.game.title,
    gameinstance: gameinstance,
  });
});
