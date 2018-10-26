export default (
    state = {
        items: []
    },
    action
) => {
    switch (action.type) {
        case "EXAMPLE":
            return { ...state, items: action.payload };
        default:
            return state;
    }
};
