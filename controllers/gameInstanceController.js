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

/// 4.321
