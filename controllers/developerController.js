const Game = require("../models/game");
const Developer = require("../models/developer");
const Publisher = require("../models/publisher");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

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
    Developer.findById(req.params.id).populate("publisher").exec(),
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

exports.developer_form_get = asyncHandler(async (req, res, next) => {
  const allPublishers = await Publisher.find().sort({ name: 1 }).exec();

  res.render("developer_form", {
    title: "Create Developer",
    list_publishers: allPublishers,
  });
});

exports.developer_form_post = [
  body("developer_name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("developer_location", "Location must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body(
    "developer_date_of_foundation",
    "Developer must have a date of foundation."
  )
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const allPublishers = await Publisher.find().sort({ name: 1 }).exec();

    const developer = new Developer({
      name: req.body.developer_name,
      publisher: req.body.developer_publisher,
      location: req.body.developer_location,
      date_of_foundation: req.body.developer_date_of_foundation,
      date_of_closing: req.body.developer_date_of_closing,
    });

    if (!errors.isEmpty()) {
      res.render("developer_form", {
        title: "Create Developer",
        developer: developer,
        list_publishers: allPublishers,
      });
      return;
    } else {
      await developer.save();
      res.redirect(developer.url);
    }
  }),
];

exports.developer_delete_get = asyncHandler(async (req, res, next) => {
  const [developer, allGamesDeveloper] = await Promise.all([
    Developer.findById(req.params.id).exec(),
    Game.find({ developer: req.params.id }).exec(),
  ]);

  if (developer === null) {
    const err = new Error("Developer was not found.");
    err.status = 404;
    return next(err);
  }

  res.render("developer_delete", {
    title: "Delete Developer",
    developer: developer,
    list_games: allGamesDeveloper,
  });
});

exports.developer_delete_post = [
  body("master_password", "Password is incorrect")
    .matches(process.env.MASTER_PASSWORD)
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const [developer, allGames] = await Promise.all([
      Developer.findById(req.params.id).exec(),
      Game.find({ developer: req.params.id }).sort({ title: 1 }).exec(),
    ]);
    if (allGames.length > 0) {
      res.render("developer_delete", {
        title: "Delete Developer",
        developer: developer,
        list_games: allGames,
        errors: errors.array(),
      });
      return;
    }
    if (!errors.isEmpty()) {
      res.render("developer_delete", {
        title: "Delete Developer",
        developer: developer,
        list_games: allGames,
        errors: errors.array(),
      });
      return;
    } else {
      await Developer.findByIdAndDelete(req.body.developer_id);
      res.redirect("/catalog/developers");
    }
  }),
];

exports.developer_update_get = asyncHandler(async (req, res, next) => {
  const [developer, allPublishers] = await Promise.all([
    Developer.findById(req.params.id).populate("publisher").exec(),
    Publisher.find().sort({ title: 1 }).exec(),
  ]);
  if (developer === null) {
    const err = Error("Developer was not found.");
    err.status = 404;
    return next(err);
  }

  res.render("developer_form", {
    title: "Update Developer",
    developer: developer,
    list_publishers: allPublishers,
  });
});

exports.developer_update_post = [
  body("master_password", "Incorrect password")
    .matches(process.env.MASTER_PASSWORD)
    .escape(),

  body("developer_name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body("developer_location", "Location must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  body(
    "developer_date_of_foundation",
    "Developer must have a date of foundation."
  )
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const developer = new Developer({
      name: req.body.developer_name,
      publisher: req.body.developer_publisher,
      location: req.body.developer_location,
      date_of_foundation: req.body.developer_date_of_foundation,
      date_of_closing: req.body.developer_date_of_closing,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allPublishers = await Publisher.find().sort({ title: 1 }).exec();
      res.render("developer_form", {
        title: "Update Developer",
        developer: developer,
        list_publishers: allPublishers,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedDeveloper = await Developer.findByIdAndUpdate(
        req.params.id,
        developer,
        {}
      );
      res.redirect(updatedDeveloper.url);
    }
  }),
];
