export default (
    state = [
        {
            taskID: 1,
            taskType: 'task',
            name: 'Cry into pillow 1',
            description: 'I feel sad',
            category: 'misc',
            priority: 0,
        },
        {
            taskID: 2,
            taskType: 'task',
            name: 'Cry into pillow 2',
            description: 'I feel sad',
            category: 'misc',
            priority: 1,
        },
        {
            taskID: 3,
            taskType: 'task',
            name: 'Cry into pillow 3',
            description: 'I feel sad',
            category: 'misc',
            priority: 2,
        },
    ],
    action
) => {
    switch (action.type) {
        case 'ADD_TASK':
            return [...state, action.payload];
        case 'REMOVE_TASK':
            return [...state].filter(
                task => task.taskID !== action.payload.taskID
            );
        case 'UPDATE_TASK':
            return [...state].map(task => {
                if (task.taskID === action.payload.taskID) {
                    return action.payload;
                }

                return task;
            });
        default:
            return state;
    }
};
