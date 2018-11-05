import { combineReducers } from 'redux';

import documentsReducer from './documentsReducer';
import eventsReducer from './eventsReducer';
import tasksReducer from './tasksReducer';
import {userReducer, itemsReducer, pinFilter, categoryFilter, itemTypeFilter, groupFilter} from './dashReducer';
export default combineReducers({
  pinFilter,
  categoryFilter,
  itemTypeFilter,
  groupFilter,
  documents: documentsReducer,
  events: eventsReducer,
  tasks: tasksReducer,
  user: userReducer,
  items: itemsReducer
});
