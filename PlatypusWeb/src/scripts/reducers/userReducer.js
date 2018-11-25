export default (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return action.payload;
    default:
      return state;
  }
};
