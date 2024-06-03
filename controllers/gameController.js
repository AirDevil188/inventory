const Game = require("../models/game");
const Publisher = require("../models/publisher");
const Developer = require("../models/developer");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");
const Platform = require("../models/platform");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
dotenv.config();
cloudinary.config().cloud_name;

cloudinary.config({
  secure: true,
});

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
    const uploadImg = async () => {
      if (req.file) {
        const img = await cloudinary.uploader.upload(
          req.file.path,
          function (err) {
            if (err instanceof multer.MulterError) {
              err.status = 404;
              return next(err);
            }
          }
        );
        return img.url;
      }
    };

    const game = new Game({
      title: req.body.game_title,
      publisher: req.body.game_publisher,
      developer: req.body.game_developer,
      summary: req.body.game_summary,
      image: req.file ? await uploadImg() : "",
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

exports.game_delete_get = asyncHandler(async (req, res, next) => {
  const [game, allGameinstace] = await Promise.all([
    Game.findById(req.params.id).exec(),
    GameInstance.find({ game: req.params.id }).exec(),
  ]);

  if (game === null) {
    const err = new Error("Game was not found.");
    err.status = 404;
    return next(err);
  }
  res.render("game_delete", {
    title: "Delete Game",
    game: game,
    list_gameinstances: allGameinstace,
  });
});

exports.game_delete_post = asyncHandler(async (req, res, next) => {
  const [game, allGameinstace] = await Promise.all([
    Game.findById(req.params.id).exec(),
    GameInstance.find({ game: req.params.id }).exec(),
  ]);

  if (allGameinstace.length > 0) {
    res.render("delete_game", {
      title: "Delete Game",
      game: game,
      list_gameinstances: allGameinstace,
    });
    return;
  } else {
    await Game.findByIdAndDelete(req.body.game_id);
    res.redirect("/catalog/games");
  }
});

exports.game_update_get = asyncHandler(async (req, res, next) => {
  const [game, allGamePublisher, allGameDeveloper, gamePlatform, gameGenre] =
    await Promise.all([
      Game.findById(req.params.id).exec(),
      Publisher.find().sort({ name: 1 }).exec(),
      Developer.find().sort({ name: 1 }).exec(),
      Platform.find().sort({ name: 1 }).exec(),
      Genre.find().sort({ name: 1 }).exec(),
    ]);

  gameGenre.forEach((genre) => {
    if (game.genre.includes(genre._id)) {
      genre.checked = true;
    }
  });

  gamePlatform.forEach((platform) => {
    if (game.platform.includes(platform._id)) {
      platform.checked = true;
    }
  });

  if (game === null) {
    const err = new Error("Game was not found.");
    err.status = 404;
    return next(err);
  }
  res.render("game_form", {
    title: "Update Game",
    game: game,
    list_publishers: allGamePublisher,
    list_developers: allGameDeveloper,
    list_platforms: gamePlatform,
    list_genres: gameGenre,
  });
});

exports.game_update_post = [
  body("master_password", "Incorrect password")
    .matches(process.env.MASTER_PASSWORD)
    .escape(),

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
    const uploadImg = async () => {
      if (req.file) {
        const img = await cloudinary.uploader.upload(
          req.file.path,
          function (err) {
            if (err instanceof multer.MulterError) {
              err.status = 404;
              return next(err);
            }
          }
        );
        return img.url;
      }
    };
    const game = new Game({
      title: req.body.game_title,
      publisher: req.body.game_publisher,
      developer: req.body.game_developer,
      summary: req.body.game_summary,
      image: req.file ? await uploadImg() : "",
      esrb_rating: req.body.game_esrb_rating,
      date_of_release: req.body.game_release_date,
      platform: req.body.game_platform,
      genre: req.body.game_genre,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const [
        game,
        allGamePublisher,
        allGameDeveloper,
        gamePlatform,
        gameGenre,
      ] = await Promise.all([
        Game.findById(req.params.id).exec(),
        Publisher.find().sort({ name: 1 }).exec(),
        Developer.find().sort({ name: 1 }).exec(),
        Platform.find().sort({ name: 1 }).exec(),
        Genre.find().sort({ name: 1 }).exec(),
      ]);

      gameGenre.forEach((genre) => {
        if (game.genre.includes(genre._id)) {
          genre.checked = true;
        }
      });

      gamePlatform.forEach((platform) => {
        if (game.platform.includes(platform._id)) {
          platform.checked = true;
        }
      });

      res.render("game_form", {
        title: "Update Game",
        list_publishers: allGamePublisher,
        list_developers: allGameDeveloper,
        list_platforms: gamePlatform,
        list_genres: gameGenre,
        game: game,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});
      res.redirect(updatedGame.url);
    }
  }),
];
