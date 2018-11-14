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
    case 'REMOVE_TASK':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category]].filter(
          task => task.taskID !== action.payload.taskID,
        ),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category]]
          .map((task) => {
            if (task.taskID === action.payload.taskID) {
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
