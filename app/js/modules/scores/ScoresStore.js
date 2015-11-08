import Reflux from 'reflux'
import ScoresActions from './ScoresActions'
import $ from 'jquery'

var apiURI = 'http://46.101.229.210/api';

var endpoints = {
  allGames: apiURI + '/games/all',
  bestGames: apiURI + '/games/best'
};

export default Reflux.createStore({
  init: function() {
    this._scores = [];
    this.listenTo(ScoresActions.ScoresUpdateAll, this.loadAllScores);
    this.listenTo(ScoresActions.ScoresUpdateBest, this.loadBestScores);
  },
  getInitialState: function() {
    return this._scores;
  },
  handleError: function(jqxhr, textStatus, err) {
    var errorMessage = textStatus + ', ' + err;
    console.error('Failed to load store: '+errorMessage);
  },
  loadAllScores: function(params) {
    $.getJSON(endpoints.allGames)
      .done(function(data) {
        this.onLoad(data.payload.games);
      }.bind(this))
      .fail(this.handleError);
  },
  loadBestScores: function(params) {
    $.getJSON(endpoints.bestGames)
      .done(function(data) {
        this.onLoad(data.payload.games);
      }.bind(this))
      .fail(this.handleError);
  },
  onLoad: function(scores) {
    this._scores = scores;
    this.trigger(this._scores);
  }
});
