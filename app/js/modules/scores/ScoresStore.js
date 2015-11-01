import Reflux from 'reflux'
import ScoresActions from './ScoresActions'
import $ from 'jquery'

export default Reflux.createStore({
  init: function() {
    this._scores = [];
    this.listenTo(ScoresActions.ScoresUpdate, this.loadScores);
  },
  getInitialState: function() {
    return [];
  },
  loadScores: function(params) {
    $.getJSON('http://46.101.229.210/api/games', function(data) {
      this.onLoad(data);
    }.bind(this));
  },
  onLoad: function(scores) {
    this._scores = scores;
    this.trigger(this._scores);
  }
});
