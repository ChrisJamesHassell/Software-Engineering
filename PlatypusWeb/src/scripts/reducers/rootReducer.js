import { combineReducers } from 'redux';

import documentsReducer from './documentsReducer';
import eventsReducer from './eventsReducer';
import tasksReducer from './tasksReducer';

export default combineReducers({
    documents: documentsReducer,
    events: eventsReducer,
    tasks: tasksReducer,
});
