const sortByExpiryDate = (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();

export default (
  state = {
    Appliances: [],
    Auto: [],
    Home: [],
    Meals: [],
    Medical: [
      {
        docID: 1,
        name: 'Dental Insurance',
        description: 'BlueCross',
        category: 'Medical',
        filename: 'IMG-12345.PNG',
        expiryDate: '2018-10-29T21:29:56.940Z',
      },
    ]
  },
  action,
) => {
  switch (action.type) {
    case 'ADD_DOCUMENT':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category], action.payload].sort(
          sortByExpiryDate,
        ),
      };
    case 'ADD_DOCUMENTS':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category], ...action.payload].sort(
          sortByExpiryDate,
        ),
      };
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category]].filter(
          task => task.docID !== action.payload.docID,
        ),
      };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        [action.payload.category]: [...state[action.payload.category]]
          .map((task) => {
            if (task.docID === action.payload.docID) {
              return action.payload;
            }

            return task;
          })
          .sort(sortByExpiryDate),
      };
    default:
      return state;
  }
};
