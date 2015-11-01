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
    return moment(dateStr, 'YYYYMMDD');
  }
  getDuration(start, end) {
    return this.getMoment(end).diff(this.getMoment(start), 'days');
  } 
  formatDate(dateStr) {
    return this.getMoment(dateStr).format('L');
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

export default class ScoresTable extends React.Component {
  constructor(props) {
    super(props);
    this.onScoresChange = this.onScoresChange.bind(this);
    this.state = {
      scores: []
    };
  }
  componentDidMount() {
    this.unsubscribe = ScoresStore.listen(this.onScoresChange);
    ScoresActions.ScoresUpdate();
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
      <table>
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

