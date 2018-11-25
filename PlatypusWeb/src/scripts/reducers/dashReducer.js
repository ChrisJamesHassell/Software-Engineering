/* REMINDER:
DO -------NOT------- DO IN A REDUCER:
Mutate its arguments;

Perform side effects like API calls and routing transitions;

Call non-pure functions, e.g. Date.now() or Math.random()
*/
import { combineReducers } from 'redux'
import * as appActions from '../actions/actions';

// const { SHOW_ALL } = appActions.CategoryFilters;

const defaultState = {
    filters: {
        pinFilter: 'SHOW_ALL', // PINNED_ONLY
        categoryFilter: 'SHOW_ALL', // 'APPLIANCES', 'AUTO', 'MEALS', 'MEDICAL'
        itemTypeFilter: 'SHOW_ALL', // 'TASKS', 'EVENTS', 'DOCUMENTS',
        groupFilter: 'USER_ONLY', // USER_ONLY, GROUP_ONLY, MULTI_GROUP
    },
    user: { // returned from the Login/Create API call
        username: null,
        userId: null,
        selfGroupId: null,
        groupList: [{}]
    },
    categories: ['Appliances', 'Auto', 'Meals', 'Medical', 'Miscellaneous'],
}

export const userReducer = (state = defaultState.user, action) => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return Object.assign({}, state, action.userData);

        case 'GET_USER_DATA':
            return state.user;
        default:
            return state;
    }
}

const pinFilterReducer = (state = appActions.PinFilters.PINNED_ONLY, action) => {
    switch (action.type) {
        case 'SET_PIN_FILTER':
            return action.filter;
        default:
            return state;
    }
}

const categoryFilterReducer = (state = appActions.CategoryFilters.SHOW_ALL, action) => {
    switch (action.type) {
        case 'SET_CATEGORY_FILTER':
            return action.filter;
        default:
            return state;
    }
}

const itemTypeFilterReducer = (state = appActions.ItemTypeFilters.SHOW_ALL, action) => {
    switch (action.type) {
        case 'SET_ITEMTYPE_FILTER':
            return action.filter;
        default:
            return state;
    }
}

const groupFilterReducer = (state = appActions.GroupFilters.SHOW_ALL, action) => {
    switch (action.type) {
        case 'SET_GROUP_FILTER':
            return action.filter;
        default:
            return state;
    }
}


export const filterReducer = combineReducers({
    pinFilterReducer,
    categoryFilterReducer,
    itemTypeFilterReducer,
    groupFilterReducer,
});

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
