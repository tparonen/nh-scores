'use strict';

var express = require('express'),
    redis   = require('redis'),
    fs      = require('fs'),
    _       = require('lodash'),
    s       = require('underscore.string');

var Promise = require('bluebird');

Promise.promisifyAll(redis);
Promise.promisifyAll(fs);

var app = express();
var router = express.Router();
var client = redis.createClient();

var paths = { 
  nethackLogfile: '/var/games/nethack/logfile'
};

client.on('connect', function() {
  console.log('connected to redis');
});

var keys = [
  'version',
  'score',
  'dungeon',
  'level',
  'max_level',
  'hit_points',
  'max_hit_points',
  'num_deaths',
  'end_date',
  'start_date',
  'user_id',
  'role',
  'race',
  'gender',
  'alignment',
  'name',
  'message'
];

var dungeonNames = [
  'The Dungeons of Doom',
  'Gehennom',
  'The Gnomish Mines',
  'The Quest',
  'Sokoban',
  'Fort Ludios',
  'Vlad\'s Tower',
  'Elemental Planes'
];

var dungeonLevels = [];
dungeonLevels[-1] = 'Plane of Earth';
dungeonLevels[-2] = 'Plane of Air';
dungeonLevels[-3] = 'Plane of Fire';
dungeonLevels[-4] = 'Plane of Water';
dungeonLevels[-5] = 'Astral Plane';

var fetchGames = function() {
  return fs.readFileAsync(paths.nethackLogfile, 'utf8')
    .then(function(data) {
      var lines = _.words(_.trim(data), /[^\r\n]+/g);
      return _.map(lines, function(line, index) {

        var parts = line.split(',');
        var values = parts[0].split(' ').concat(parts[1]);
        var game = _.object(keys, values);

        game.score = _.parseInt(game.score, 10);
        game.level = _.parseInt(game.level, 10);
        game.max_level = _.parseInt(game.max_level, 10);
        game.hit_points = _.parseInt(game.hit_points, 10);
        game.max_hit_points = _.parseInt(game.max_hit_points, 10);
        game.num_deaths = _.parseInt(game.num_deaths, 10);
        game.user_id = undefined;

        if (dungeonNames[game.dungeon] !== undefined) {
          game.dungeon = dungeonNames[game.dungeon];
        }
        if (dungeonLevels[game.level] !== undefined) {
          game.level = dungeonLevels[game.level];
        }
        game.row_id = index;

        return game;
      });
    });
};

var logReadError = function(err) {
  console.error('Failed to read file: '+err);
};

var getErrorResponse = function(err) {
  return {error: {message: 'An error occurred'}};
};

var getResponse = function(data) {
  return {payload: data};
};

var getAllGames = function(req, res, next) {
  fetchGames()
    .then(function(games) {
      res.json(getResponse({games: games}));
    })
    .catch(function(err) {
      logReadError(err);
      res.json(getErrorResponse(err));
    });
};

router.get('/', getAllGames);

router.get('/all', getAllGames);

var sortGames = function(games) {
  return _.sortBy(games, 'score').reverse();
};

var getBestGames = function(req, res, next) {
  fetchGames()
    .then(function(games) {
      var sorted = sortGames(games);
      res.json(getResponse({games: sorted}));
    })
    .catch(function(err) {
      logReadError(err);
      res.json(getErrorResponse(err));
    });
};

router.get('/best', getBestGames);

module.exports = router;
