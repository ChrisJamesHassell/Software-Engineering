/* REMINDER:
DO -------NOT------- DO IN A REDUCER:
Mutate its arguments;

Perform side effects like API calls and routing transitions;

Call non-pure functions, e.g. Date.now() or Math.random()
*/
import { PinFilters, CategoryFilters, ItemTypeFilters, GroupFilters } from '../actions/actions'
const defaultState = {
    pinFilter: 'SHOW_ALL', // PINNED_ONLY
    categoryFilter: 'SHOW_ALL', // 'APPLIANCES', 'AUTO', 'MEALS', 'MEDICAL'
    itemTypeFilter: 'SHOW_ALL', // 'TASKS', 'EVENTS', 'DOCUMENTS',
    groupFilter: 'USER_ONLY', // USER_ONLY, GROUP_ONLY, MULTI_GROUP
    user: { // returned from the Login/Create API call
        username: "mikah1337",
        userId: 24,
        selfGroupId: 24,
        groupList: [{}]
    },
    maxItems: 10,
    categories: ['Appliances', 'Auto', 'Meals', 'Medical'],
    subCategories: ['Tasks', 'Events', 'Documents'],
    items: {
        'Appliances': {
            'Tasks': [{
                type: 'Tasks',
                id: 0,
                name: 'task01',
                pinned: true,
                description: 'description for task 1',
                category: 'Medical',
                data: {}
            }],
            'Events': [{}],
            'Documents': [{}]
        },
        'Auto': {
            'Tasks': [{}],
            'Events': [{}],
            'Documents': [{}]
        },
        'Meals': {
            'Tasks': [{}],
            'Events': [{}],
            'Documents': [{}]
        },
        'Medical': {
            'Tasks': [{}],
            'Events': [{}],
            'Documents': [{}]
        }
    }
}
export const userReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return Object.assign({ ...state }, { user: { ...action.userData } })
        case 'GET_USER_DATA':
            return state.user;
        default:
            return state;
    }
}

export const itemsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'GET_ITEMS':
            return state.items;
        default:
            return state;
    }
}

export const pinFilter = (state = PinFilters.PINNED_ONLY, action) => {
    switch (action.type) {
        case 'SET_PIN_FILTER':
            return action.filter;
        default:
            return state;
    }
}

export const categoryFilter = (state = CategoryFilters.SHOW_ALL, action) => {
    switch (action.type) {
        case 'SET_CATEGORY_FILTER':
            return action.filter;
        default:
            return state;
    }
}

export const itemTypeFilter = (state = ItemTypeFilters.SHOW_ALL, action) => {
    switch (action.type) {
        case 'SET_ITEMTYPE_FILTER':
            return action.filter;
        default:
            return state;
    }
}

export const groupFilter = (state = GroupFilters.SHOW_ALL, action) => {
    switch (action.type) {
        case 'SET_GROUP_FILTER':
            return action.filter;
        default:
            return state;
    }
}


// export const items = (state = defaultState, action) => {
//     switch(action.type){
//         case 'GET_ITEMS':
//             return Object.assign({...state}, {})
//     }
// }


    // items: [
    //     {
    //         type: 'TASK',
    //         id: 0,
    //         name: 'task01',
    //         pinned: true,
    //         description: 'description for task 1',
    //         category: 'MEDICAL',
    //         data: {
    //             startDate: ...,
    //             endDate: ...,
    //             location: ...
    //         }
    //     },
    //             {
    //         type: 'EVENT',
    //         id: 0,
    //         name: 'event01',
    //         pinned: true,
    //         description: 'description for event 1',
    //         category: 'AUTO',
    //         data: {
    //             deadline: ...,
    //             priority: ...,
    //             completed: ...
    //         }
    //     },
    //             {
    //         type: 'DOCUMENT',
    //         id: 0,
    //         name: 'task01',
    //         pinned: true,
    //         description: 'description for task 1',
    //         category: 'MEDICAL',
    //         data: {
    //             fileName: ...,
    //             expirationDate: ...
    //         }
    //     }
    // ]
//}
