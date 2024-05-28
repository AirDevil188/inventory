const Game = require("../models/game");
const Developer = require("../models/developer");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.list_developers = asyncHandler(async (req, res, next) => {
  const allDevelopers = await Developer.find()
    .sort({ name: 1 })
    .populate("publisher")
    .exec();

  res.render("list_developers", {
    title: "Developers List",
    developer_list: allDevelopers,
  });
});

exports.developer_detail = asyncHandler(async (req, res, next) => {
  const [developer, allGames] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }).exec(),
  ]);

  if (developer === null) {
    const err = new Error("Developer was not found.");
    err.status = 404;
    return next(err);
  }

  res.render("developer_detail", {
    title: developer.name,
    developer: developer,
    all_games: allGames,
  });
});
