import React from 'react'
import Reflux from 'reflux'
import ScoresActions from './ScoresActions'
import ScoresStore from './ScoresStore'

class ScoresRow extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <tr>
        <td>{this.props.entry.name}</td>
        <td>{this.props.entry.score}</td>
        <td>{this.props.entry.message}</td>
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
            <th>Score</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}

