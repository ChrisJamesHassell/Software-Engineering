const sortByPriority = (a, b) => b.priority - a.priority;

export default (state = {}, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        [action.payload.category]: [...(state[action.payload.category] || []), action.payload].sort(
          sortByPriority,
        ),
      };
    case 'ADD_TASKS': {
      if (action.payload.length === 0) {
        return state;
      }

      return action.payload.reduce(
        (prev, curr) => ({
          ...prev,
          [curr.category]: [...(prev[curr.category] || []), curr].sort(sortByPriority),
        }),
        { ...state },
      );
    }
    case 'REMOVE_ALL_TASKS':
      return {};
    case 'REMOVE_TASK': {
      const obj = {
        ...state,
        [action.payload.category]: [...state[action.payload.category]].filter(
          task => task.itemID !== action.payload.itemID,
        ),
      };

      if (obj[action.payload.category].length === 0) {
        delete obj[action.payload.category];
      }

      return obj;
    }
    case 'UPDATE_TASK':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category]]
          .map((task) => {
            if (task.itemID === action.payload.itemID) {
              return action.payload;
            }

            return task;
          })
          .sort(sortByPriority),
      };
    default:
      return state;
  }
};
