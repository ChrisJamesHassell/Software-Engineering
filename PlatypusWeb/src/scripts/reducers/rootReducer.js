import { combineReducers } from 'redux';

import documentsReducer from './documentsReducer';
import eventsReducer from './eventsReducer';
import tasksReducer from './tasksReducer';
import userReducer from './userReducer';

export default combineReducers({
  documents: documentsReducer,
  events: eventsReducer,
  tasks: tasksReducer,
  user: userReducer,
});
