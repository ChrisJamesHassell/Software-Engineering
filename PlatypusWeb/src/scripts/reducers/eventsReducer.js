function sortByStartDate(a, b) {
    const aTime = new Date(a.start).getTime();
    const bTime = new Date(b.start).getTime();

    return aTime - bTime;
}

export default (
    state = [
        {
            eventID: 1,
            name: 'Event Name',
            description: 'Event Description',
            category: 'Miscellaneous',
            start: '2018-10-29T21:29:48.475Z',
            end: '2018-10-29T21:29:56.940Z',
            location: 'That one place',
        },
    ],
    action
) => {
    switch (action.type) {
        case 'ADD_EVENT':
            return [...state, action.payload].sort(sortByStartDate);
        case 'ADD_EVENTS':
            return [...state, ...action.payload].sort(sortByStartDate);
        case 'REMOVE_EVENT':
            return [...state].filter(
                event => event.eventID !== action.payload.eventID
            );
        case 'UPDATE_EVENT':
            return [...state]
                .map(event => {
                    if (event.eventID === action.payload.eventID) {
                        return action.payload;
                    }

                    return event;
                })
                .sort(sortByStartDate);
        default:
            return state;
    }
};
