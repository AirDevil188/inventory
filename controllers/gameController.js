const Game = require("../models/game");
const Publisher = require("../models/publisher");
const Developer = require("../models/developer");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");
const Platform = require("../models/platform");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const [numGames, numPublishers, numDevelopers, numGenres, numGameInstances] =
    await Promise.all([
      Game.countDocuments().exec(),
      Publisher.countDocuments().exec(),
      Developer.countDocuments().exec(),
      Genre.countDocuments().exec(),
      GameInstance.countDocuments().exec(),
    ]);

  res.render("index", {
    title: "Games Library",
    num_games: numGames,
    num_publishers: numPublishers,
    num_developers: numDevelopers,
    num_genres: numGenres,
    num_gameinstances: numGameInstances,
  });
});

exports.list_games = asyncHandler(async (req, res, next) => {
  const allGames = await Game.find()
    .populate("developer")
    .sort({ title: 1 })
    .exec();

  res.render("list_games", {
    title: "All Games",
    game_list: allGames,
  });
});

exports.game_detail = asyncHandler(async (req, res, next) => {
  const [game, gameInstances] = await Promise.all([
    Game.findById(req.params.id)
      .populate("developer")
      .populate("publisher")
      .populate("genre")
      .populate("platform")
      .exec(),
    GameInstance.find({ game: req.params.id }).exec(),
  ]);

  if (game === null) {
    const err = new Error("Game not found.");
    err.status = 404;
    return next(err);
  }

  res.render("game_detail", {
    title: game.title,
    game: game,
    game_instances: gameInstances,
  });
});

exports.game_form_get = asyncHandler(async (req, res, next) => {
  const [allPublishers, allDevelopers, allPlatforms, allGenres] =
    await Promise.all([
      Publisher.find().sort({ name: 1 }).exec(),
      Developer.find().sort({ name: 1 }).exec(),
      Platform.find().sort({ name: 1 }).exec(),
      Genre.find().sort({ name: 1 }).exec(),
    ]);
  res.render("game_form", {
    title: "Create Game",
    list_publishers: allPublishers,
    list_developers: allDevelopers,
    list_platforms: allPlatforms,
    list_genres: allGenres,
  });
});

exports.game_form_post = [
  body("game_title", "Title must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("game_publisher", "Publisher must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("game_developer", "Developer must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("game_summary", "Game summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("game_release_date", "Game must have a release date.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("game_esrb_rating", "Game ESRB Rating must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("game_genre", "Genre must not be empty").notEmpty().escape(),

  body("game_platform", "Platform must not be empty").notEmpty().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors, "err");

    const game = new Game({
      title: req.body.game_title,
      publisher: req.body.game_publisher,
      developer: req.body.game_developer,
      summary: req.body.game_summary,
      esrb_rating: req.body.game_esrb_rating,
      date_of_release: req.body.game_release_date,
      platform: req.body.game_platform,
      genre: req.body.game_genre,
    });

    if (!errors.isEmpty()) {
      const [allPublishers, allDevelopers, allPlatforms, allGenres] =
        await Promise.all([
          Publisher.find().sort({ name: 1 }).exec(),
          Developer.find().sort({ name: 1 }).exec(),
          Platform.find().sort({ name: 1 }).exec(),
          Genre.find().sort({ name: 1 }).exec(),
        ]);

      res.render("game_form", {
        title: "Create Game",
        list_publishers: allPublishers,
        list_developers: allDevelopers,
        list_platforms: allPlatforms,
        list_genres: allGenres,
        errors: errors.array(),
      });
    } else {
      await game.save();
      res.redirect(game.url);
    }
  }),
];
