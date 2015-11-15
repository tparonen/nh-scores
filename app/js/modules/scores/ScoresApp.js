import React from 'react'
import Reflux from 'reflux'
import moment from 'moment'
import ScoresActions from './ScoresActions'
import ScoresStore from './ScoresStore'

class ScoresRow extends React.Component {
  constructor(props) {
    super(props);
  }
  getMoment(dateStr) {
    moment.locale('fi');
    return moment(dateStr, 'YYYYMMDD');
  }
  getDuration(start, end) {
    return this.getMoment(end).diff(this.getMoment(start), 'days');
  } 
  formatDate(dateStr) {
    return this.getMoment(dateStr).format('DD/MM/YYYY');
  }
  formatCharacter(entry) {
    return (
      entry.role + '-' + entry.race + '-' +
      entry.gender + '-' + entry.alignment
    );
  }
  render() {
    var entry = this.props.entry;
    return (
      <tr>
        <td>{entry.name}</td>
        <td>{this.formatCharacter(entry)}</td>
        <td>{entry.score}</td>
        <td>{entry.dungeon}</td>
        <td>{entry.level}</td>
        <td>{entry.hit_points}/{entry.max_hit_points}</td>
        <td>{this.getDuration(entry.start_date, entry.end_date)} days</td>
        <td>{this.formatDate(entry.end_date)}</td>
        <td>{entry.message}</td>
      </tr>
    );
  }
}

class ScoresTable extends React.Component {
  constructor(props) {
    super(props);
    this.onScoresChange = this.onScoresChange.bind(this);
    this.state = {
      scores: []
    };
  }
  componentDidMount() {
    this.unsubscribe = ScoresStore.listen(this.onScoresChange);
    ScoresActions.ScoresUpdateAll();
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  onScoresChange(scores) {
    this.setState({ scores: scores });
  }
  render() {
    var rows = [];
    this.state.scores.forEach(function(entry) {
      rows.push(<ScoresRow entry={entry} key={entry.row_id} />);
    });
    return (
      <table className="pure-table pure-table-horizontal pure-table-striped scores-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Character</th>
            <th>Points</th>
            <th>Dungeon</th>
            <th>Level</th>
            <th>HP</th>
            <th>Duration</th>
            <th>Date</th>
            <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

export default class ScoresApp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h4>Latest games</h4>
        <ScoresTable />
      </div>
    );
  }
}
