export default (
    state = [
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
    action
) => {
    switch (action.type) {
        case 'ADD_TASK':
            return [...state, action.payload].sort(
                (a, b) => b.priority - a.priority
            );
        case 'ADD_TASKS':
            return [...state, ...action.payload].sort(
                (a, b) => b.priority - a.priority
            );
        case 'REMOVE_TASK':
            return [...state].filter(
                task => task.taskID !== action.payload.taskID
            );
        case 'UPDATE_TASK':
            return [...state]
                .map(task => {
                    if (task.taskID === action.payload.taskID) {
                        return action.payload;
                    }

                    return task;
                })
                .sort((a, b) => b.priority - a.priority);
        default:
            return state;
    }
};
