import Reflux from 'reflux';

export default Reflux.createActions({
  'ScoresUpdateAll': {
    asyncResult: true,
    preEmit: function() {},
    shouldEmit: function() { return true; }
  },
  'ScoresUpdateBest': {
    asyncResult: true,
    preEmit: function() {},
    shouldEmit: function() { return true; }
  }
});
