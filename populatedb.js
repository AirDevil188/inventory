#! /usr/bin/env node

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Publisher = require("./models/publisher");
const Developer = require("./models/developer");
const Platform = require("./models/platform");
const Genre = require("./models/genre");
const GameInstance = require("./models/gameinstance");

const platforms = [];
const genres = [];
const publishers = [];
const developers = [];
const games = [];
const gameinstances = [];
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createPlatforms();
  await createGenres();
  await createPublishers();
  await createDevelopers();
  await createGames();
  await createGameInstances();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function platformCreate(index, name) {
  const platform = new Platform({ name: name });
  await platform.save();
  platforms[index] = platform;
  console.log(`Added platform: ${name}`);
}

async function publisherCreate(index, name, location, d_foundation, d_closing) {
  const publisherdetail = { name: name, location: location };

  if (d_foundation != false) publisherdetail.date_of_foundation = d_foundation;
  if (d_closing != false) publisherdetail.date_of_closing = d_closing;

  const publisher = new Publisher(publisherdetail);
  await publisher.save();
  publishers[index] = publisher;
  console.log(`Added publisher: ${name} ${location}`);
}

async function developerCreate(
  index,
  name,
  publisher,
  location,
  d_foundation,
  d_closing
) {
  const developerdetail = {
    name: name,
    location: location,
    publisher: publisher,
  };
  if (d_foundation != false) developerdetail.date_of_foundation = d_foundation;
  if (d_closing != false) developerdetail.date_of_closing = d_closing;

  const developer = new Developer(developerdetail);

  await developer.save();
  developers[index] = developer;
  console.log(`Added developer: ${name} ${location}`);
}

async function gameCreate(
  index,
  title,
  summary,
  date_of_release,
  esrb_rating,
  publisher,
  developer,
  platform,
  genre
) {
  const gamedetail = {
    title: title,
    summary: summary,
    date_of_release: date_of_release,
    publisher: publisher,
    developer: developer,
    esrb_rating: esrb_rating,
  };
  if (genre != false) gamedetail.genre = genre;
  if (platform != false) gamedetail.platform = platform;

  const game = new Game(gamedetail);
  await game.save();
  games[index] = game;
  console.log(`Added game: ${title}`);
}

async function gameInstanceCreate(index, game, platform, status, due_back) {
  const gameinstancedetail = {
    game: game,
    platform: platform,
  };
  if (due_back != false) gameinstancedetail.due_back = due_back;
  if (status != false) gameinstancedetail.status = status;

  const gameinstance = new GameInstance(gameinstancedetail);
  await gameinstance.save();
  gameinstances[index] = gameinstance;
  console.log(`Added gameinstance: ${platform}`);
}

async function createPlatforms() {
  console.log("Adding platforms");
  await Promise.all([
    platformCreate(0, "PC"),
    platformCreate(1, "Playstation 5"),
    platformCreate(2, "Xbox Series X"),
    platformCreate(3, "Xbox Series S"),
    platformCreate(4, "Nintendo Switch"),
    platformCreate(5, "Xbox 360"),
    platformCreate(6, "Playstation 1"),
    platformCreate(7, "Steam Deck"),
  ]);
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "Action Adventure"),
    genreCreate(1, "RPG"),
    genreCreate(2, "FPS"),
    genreCreate(3, "Survival Horror"),
  ]);
}

async function createPublishers() {
  console.log("Adding publishers");

  await Promise.all([
    publisherCreate(0, "CD Projekt Red", "Warsaw, Poland", "20002-03-6", false),
    publisherCreate(1, "Activision", "Santa Monica, CA", "1979-10-1", false),
    publisherCreate(2, "Take-Two", "New York, NY", "1993-09-03", false),
    publisherCreate(3, "Capcom", "Osaka, Japan", "1979-05-30", false),
  ]);
}

async function createDevelopers() {
  console.log("Adding developers");
  await Promise.all([
    developerCreate(
      0,
      "CD Projekt Red",
      publishers[0],
      "Warsaw, Poland",
      "2002-03-6",
      false
    ),
    developerCreate(
      1,
      "Rockstar Games",
      publishers[2],
      "New York City, NY",
      "1998-12-1",
      false
    ),
    developerCreate(
      2,
      "Infinity Ward",
      publishers[1],
      "Los Angeles, CA",
      "2002-05-21",
      false
    ),
    developerCreate(
      4,
      "Capcom",
      publishers[3],
      "Osaka, Japan",
      "1979-05-30",
      false
    ),
  ]);
}

async function createGames() {
  console.log("Adding Games");
  await Promise.all([
    gameCreate(
      0,
      "The Witcher 3: Wild Hunt",
      "The monster slayer Geralt of Rivia must find his adoptive daughter who is being pursued by the Wild Hunt, and prevent the White Frost from bringing about the end of the world.",
      "2015-05-18",
      "Mature 17+",
      publishers[0],
      developers[0],
      [
        platforms[0],
        platforms[1],
        platforms[2],
        platforms[3],
        platforms[4],
        platforms[7],
      ],
      [genres[1]]
    ),
    gameCreate(
      1,
      "Grand Theft Auto V",
      "Players can freely explore the open world. The story is about three protagonists: retired bank robber Michael De Santa, street gangster Franklin Clinton, and drug dealer and gunrunner Trevor Philips. They attempts to commit robberies while under pressure from a corrupt government agency and powerful criminals.",
      "2013-09-17",
      "Mature 17+",
      publishers[2],
      developers[1],
      [
        platforms[0],
        platforms[1],
        platforms[2],
        platforms[3],
        platforms[5],
        platforms[7],
      ],
      [genres[0]]
    ),

    gameCreate(
      2,
      "Resident Evil 2",
      "Leon S Kennedy a rookie cop with the RPD and Claire Redfield are stuck in Raccoon City during the outbreak and have to survive the oncoming zombie hordes and track down Claire's brother Chris.",
      "1998-01-28",
      "Mature 17+",
      publishers[3],
      developers[4],
      [platforms[6]],
      [genres[3]]
    ),
  ]);
}

async function createGameInstances() {
  console.log("Adding gameinstances");
  await Promise.all([
    gameInstanceCreate(0, games[0], "PC", "Available", false),
    gameInstanceCreate(1, games[1], "XBOX 360", "Maintenance", false),
    gameInstanceCreate(2, games[0], "PS4", "Loaned", false),
  ]);
}
