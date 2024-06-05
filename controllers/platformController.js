const Game = require("../models/game");
const Platform = require("../models/platform");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

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

exports.platform_form_get = asyncHandler(async (req, res, next) => {
  res.render("platform_form", {
    title: "Create Platform",
  });
});

exports.platform_form_post = [
  body("platform_name", "Platform name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const platform = new Platform({
      name: req.body.platform_name,
    });

    if (!errors.isEmpty()) {
      res.render("platform_form");
    } else {
      await platform.save();
      res.redirect(platform.url);
    }
  }),
];

exports.platform_delete_get = asyncHandler(async (req, res, next) => {
  const [platform, allGamesPlatform] = await Promise.all([
    Platform.findById(req.params.id).exec(),
    Game.find({ platform: req.params.id }).sort({ title: 1 }).exec(),
  ]);

  if (platform === null) {
    const err = new Error("Platform was not found.");
    err.status = 404;
    return next(err);
  }

  res.render("platform_delete", {
    title: "Delete Platform",
    platform: platform,
    list_games: allGamesPlatform,
  });
});

// exports.platform_delete_post = asyncHandler(async (req, res, next) => {

//   const [platform, allGamesPlatform] = await Promise.all([
//     Platform.findById(req.params.id).exec(),
//     Game.find({ platform: req.params.id }).sort({ title: 1 }).exec(),
//   ]);

//   if (allGamesPlatform.length > 0) {
//     res.render("platform_delete", {
//       title: "Delete Platform",
//       platform: platform,
//       list_games: allGamesPlatform,
//     });
//     return;
//   } else {
//     await Platform.findByIdAndDelete(req.body.platform_id);
//     res.redirect("/catalog/platforms");
//   }
// });

exports.platform_delete_post = [
  body("master_password", "Incorrect password")
    .matches(process.env.MASTER_PASSWORD)
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [platform, allGamesPlatform] = await Promise.all([
      Platform.findById(req.params.id).exec(),
      Game.find({ platform: req.params.id }).sort({ title: 1 }).exec(),
    ]);
    if (allGamesPlatform.length > 0) {
      res.render("platform_delete", {
        title: "Delete Platform",
        platform: platform,
        list_games: allGamesPlatform,
        errors: errors.array(),
      });
      return;
    }
    if (!errors.isEmpty()) {
      const [platform, allGamesPlatform] = await Promise.all([
        Platform.findById(req.params.id).exec(),
        Game.find({ platform: req.params.id }).exec(),
      ]);

      res.render("platform_delete", {
        title: "Delete Platform",
        platform: platform,
        list_games: allGamesPlatform,
        errors: errors.array(),
      });
    } else {
      await Platform.findByIdAndDelete(req.params.id);
      res.redirect("/catalog/platforms");
    }
  }),
];

exports.platform_update_get = asyncHandler(async (req, res, next) => {
  const platform = await Platform.findById(req.params.id);

  if (platform === null) {
    const err = new Error("Platform was not found.");
    err.status = 404;
    return next(err);
  }

  res.render("platform_form", {
    title: "Update Platform",
    platform: platform,
  });
});

exports.platform_update_post = [
  body("platform_name", "Platform name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("master_password", "Incorrect password")
    .matches(process.env.MASTER_PASSWORD)
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const platform = new Platform({
      name: req.body.platform_name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("platform_form", {
        title: "Update Platform",
        platform: platform,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedPlatform = await Platform.findByIdAndUpdate(
        req.params.id,
        platform,
        {}
      );
      res.redirect(updatedPlatform.url);
    }
  }),
];
