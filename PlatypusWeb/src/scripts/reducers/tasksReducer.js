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

      let oldCat = '';
      const items = [state[action.payload.category]][0] ? [...state[action.payload.category]] : []
      Object.keys(state).forEach((category, ind) => {
        state[category].map(item => {
          if (item.itemID === action.payload.itemID) oldCat = category;
        })
      })

      if (oldCat !== action.payload.category) { // then switching categories
        // delete from old category:
        const obj = {
          ...state,
          [oldCat]: [...state[oldCat]].filter(
            task => task.itemID !== action.payload.itemID,
          ),
        };

        if (obj[oldCat].length === 0) {
          delete obj[oldCat];
        }

        // add to new category:
        return {
          ...obj,
          [action.payload.category]: [...items, action.payload]
        }

      }

      return {
        ...state,
        [action.payload.category]: [...items]
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
