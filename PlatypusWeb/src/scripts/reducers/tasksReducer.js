const sortByPriority = (a, b) => b.priority - a.priority;

export default (
  state = {
    Miscellaneous: [
      {
        taskID: 3,
        name: 'Cry into pillow 3',
        description: 'I feel sad',
        category: 'Miscellaneous',
        deadline: '2018-10-29T19:30:34.888Z',
        priority: 2,
      },
      {
        taskID: 2,
        name: 'Cry into pillow 2',
        description: 'I feel sad',
        category: 'Miscellaneous',
        deadline: '2018-10-29T19:30:34.888Z',
        priority: 1,
      },
      {
        taskID: 1,
        name: 'Cry into pillow 1',
        description: 'I feel sad',
        category: 'Miscellaneous',
        deadline: '2018-10-29T19:30:34.888Z',
        priority: 0,
      },
    ],
  },
  action,
) => {
  switch (action.type) {
    case 'ADD_TASK':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category], action.payload].sort(
          sortByPriority,
        ),
      };
    case 'ADD_TASKS': {
      if (action.payload.length === 0) {
        return state;
      }

      return {
        ...state,
        [action.payload[0].category]: [...state[action.payload.category], ...action.payload].sort(
          sortByPriority,
        ),
      };
    }
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
