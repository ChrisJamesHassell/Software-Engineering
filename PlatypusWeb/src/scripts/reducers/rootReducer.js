import { combineReducers } from 'redux';

import documentsReducer from './documentsReducer';
import eventsReducer from './eventsReducer';
import tasksReducer from './tasksReducer';
import { filterReducer, userReducer } from './dashReducer';

export default combineReducers({
  filters: filterReducer,
  documents: documentsReducer,
  events: eventsReducer,
  tasks: tasksReducer,
  user: userReducer,
});
