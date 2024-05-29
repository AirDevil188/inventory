const Game = require("../models/game");
const Platform = require("../models/platform");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.list_platforms = asyncHandler(async (req, res, next) => {
  const allPlatforms = await Platform.find().sort({ name: 1 }).exec();

  res.render("list_platforms", {
    title: "List Platforms",
    platform_list: allPlatforms,
  });
});

exports.platform_detail = asyncHandler(async (req, res, next) => {
  const [platform, allGamesPlatform] = await Promise.all([
    Platform.findById(req.params.id).exec(),
    Game.find({ platform: req.params.id }).sort({ title: 1 }).exec(),
  ]);
  if (platform === null) {
    const err = new Error("Platform  was not found");
    err.status = 404;
    return next(err);
  }
  res.render("platform_detail", {
    title: platform.title,
    platform: platform,
    list_games: allGamesPlatform,
  });
});
