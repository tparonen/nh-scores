import Reflux from 'reflux';

export default Reflux.createActions([
  {
    'ScoresUpdate': {
      asyncResult: true,
      preEmit: function() {
      
      },
      shouldEmit: function() {
        return true;
      }
    }
  }
]);
