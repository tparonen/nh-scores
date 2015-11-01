import React from 'react'
import ReactDOM from 'react-dom'

import ScoresTable from './modules/scores/ScoresTable'

$(document).foundation();

ReactDOM.render(<ScoresTable />, document.getElementById('scores-app'));

