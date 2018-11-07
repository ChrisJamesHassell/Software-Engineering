const sortByStartDate = (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime();

export default (
  state = {
    Appliances: [],
    Auto: [],
    Home: [],
    Meals: [],
    Medical: []
  },
  action,
) => {
  switch (action.type) {
    case 'ADD_EVENT':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category], action.payload].sort(
          sortByStartDate,
        ),
      };
    case 'ADD_EVENTS':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category], ...action.payload].sort(
          sortByStartDate,
        ),
      };
    case 'REMOVE_EVENT':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category]].filter(
          task => task.eventID !== action.payload.eventID,
        ),
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category]]
          .map((task) => {
            if (task.eventID === action.payload.eventID) {
              return action.payload;
            }

            return task;
          })
          .sort(sortByStartDate),
      };
    default:
      return state;
  }
};
