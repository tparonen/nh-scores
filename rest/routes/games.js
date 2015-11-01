'use strict';

var express = require('express'),
    redis   = require('redis'),
    fs      = require('fs'),
    _       = require('underscore'),
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

router.get('/', function(req, res, next) {
  fs.readFileAsync(paths.nethackLogfile, 'utf8').then(function(data) {
    var lines = s.lines(s.trim(data));
    var games = _.map(lines, function(line, index) {
      var parts = line.split(',');
      var values = s.words(parts[0]).concat(parts[1]);
      var game = _.object(keys, values);
      if (dungeonNames[game.dungeon] !== undefined) {
        game.dungeon = dungeonNames[game.dungeon];
      }
      if (dungeonLevels[game.level] !== undefined) {
        game.level = dungeonLevels[game.level];
      }
      game.row_id = index;
      return game;
    });
    res.json(games);
  }, function(err) {
    res.send('failed to read file');
  });
});

module.exports = router;
