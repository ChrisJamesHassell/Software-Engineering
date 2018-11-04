export default (
  state = [
    {
      documentID: 1,
      name: 'Dental Insurance',
      description: 'BlueCross',
      category: 'Medical',
      filename: 'IMG-12345.PNG',
      expiryDate: '2018-10-29T21:29:56.940Z',
    },
  ],
  action,
) => {
  switch (action.type) {
    case 'ADD_DOCUMENT':
      return [...state, action.payload];
    case 'ADD_DOCUMENTS':
      return [...state, ...action.payload];
    case 'REMOVE_DOCUMENT':
      return [...state].filter(
        doc => doc.documentID !== action.payload.documentID,
      );
    case 'UPDATE_DOCUMENT':
      return [...state].map((doc) => {
        if (doc.documentID === action.payload.documentID) {
          return action.payload;
        }

        return doc;
      });
    default:
      return state;
  }
};
