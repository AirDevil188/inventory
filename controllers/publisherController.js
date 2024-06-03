const Game = require("../models/game");
const Publisher = require("../models/publisher");
const Developer = require("../models/developer");

const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const dotenv = require("dotenv");
dotenv.config();

exports.list_publishers = asyncHandler(async (req, res, next) => {
  const allPublishers = await Publisher.find().sort("name");

  res.render("list_publishers", {
    title: "All Publishers",
    publisher_list: allPublishers,
  });
});

exports.publisher_detail = asyncHandler(async (req, res, next) => {
  const [publisher, allGamesByPublisher] = await Promise.all([
    Publisher.findById(req.params.id).exec(),
    Game.find({ publisher: req.params.id }).exec(),
  ]);

  if (publisher === null) {
    const err = new Error("Publisher not found.");
    err.status = 404;
    return next(err);
  }

  res.render("publisher_detail", {
    title: publisher.name,
    publisher: publisher,
    all_games: allGamesByPublisher,
  });
});

exports.publisher_form_get = asyncHandler(async (req, res, next) => {
  res.render("publisher_form", {
    title: "Create Publisher",
  });
});

exports.publisher_form_post = [
  body("publisher_name", "Publisher name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("publisher_location", "Publisher location must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "publisher_date_of_foundation",
    "Publisher must have a date of foundation."
  )
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const publisher = new Publisher({
      name: req.body.publisher_name,
      location: req.body.publisher_location,
      date_of_foundation: req.body.publisher_date_of_foundation,
      date_of_closing: req.body.publisher_date_of_closing,
    });

    if (!errors.isEmpty()) {
      res.render("publisher_form", {
        title: "Create Publisher",
        errors: errors.array(),
        publisher: publisher,
      });
      return;
    } else {
      await publisher.save();
      res.redirect(publisher.url);
    }
  }),
];

exports.publisher_delete_get = asyncHandler(async (req, res, next) => {
  const [publisher, allGamesPublisher, allDevelopersPublisher] =
    await Promise.all([
      Publisher.findById(req.params.id).exec(),
      Game.find({ publisher: req.params.id }).sort({ title: 1 }).exec(),
      Developer.find({ publisher: req.params.id }).sort({ name: 1 }).exec(),
    ]);

  if (allGamesPublisher === null) {
    const err = new Error("Games by this publisher were not found.");
    err.status = 404;
    return next(err);
  }

  res.render("publisher_delete", {
    title: "Delete Publisher",
    publisher: publisher,
    list_games: allGamesPublisher,
    list_developers: allDevelopersPublisher,
  });
});

exports.publisher_delete_post = asyncHandler(async (req, res, next) => {
  const [publisher, allGamesPublisher, allDevelopersPublisher] =
    await Promise.all([
      Publisher.findById(req.params.id).exec(),
      Game.find({ publisher: req.params.id }).sort({ title: 1 }).exec(),
      Developer.find({ publisher: req.params.id }).sort({ name: 1 }).exec(),
    ]);

  if (allGamesPublisher.length > 0 || allDevelopersPublisher.length > 0) {
    res.render("publisher_delete", {
      title: "Delete Publisher",
      publisher: publisher,
      list_developers: allDevelopersPublisher,
      list_games: allGamesPublisher,
    });
    return;
  } else {
    await Publisher.findByIdAndDelete(req.body.publisher_id);
    res.redirect("/catalog/publishers");
  }
});

exports.publisher_update_get = asyncHandler(async (req, res, next) => {
  const publisher = await Publisher.findById(req.params.id).exec();

  if (publisher === null) {
    const err = new Error("Publisher was not found.");
    err.status = 404;
    next(err);
  }
  res.render("publisher_form", {
    title: "Update Publisher",
    publisher: publisher,
  });
});

exports.publisher_update_post = [
  body("master_password", "Incorrect password")
    .matches(process.env.MASTER_PASSWORD)
    .escape(),

  body("publisher_name", "Publisher name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("publisher_location", "Publisher location must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "publisher_date_of_foundation",
    "Publisher must have a date of foundation."
  )
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const publisher = new Publisher({
      name: req.body.publisher_name,
      location: req.body.publisher_location,
      date_of_foundation: req.body.publisher_date_of_foundation,
      date_of_closing: req.body.publisher_date_of_closing,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("publisher_form", {
        title: "Update Publisher",
        publisher: publisher,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedPublisher = await Publisher.findByIdAndUpdate(
        req.params.id,
        publisher,
        {}
      );
      res.redirect(updatedPublisher.url);
    }
  }),
];
