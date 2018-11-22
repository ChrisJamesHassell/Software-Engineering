// import fetch from 'cross-fetch';
// import { path } from '../fetchHelpers';
// ====================================================== //
//  ACTION TYPES
// ====================================================== //
export const SET_PIN_FILTER = 'SET_PIN_FILTER';
export const SET_CATEGORY_FILTER = 'SET_CATEGORY_FILTER';
export const SET_ITEMTYPE_FILTER = 'SET_ITEMTYPE_FILTER';
export const SET_GROUP_FILTER = 'SET_GROUP_FILTER';
export const SET_USER_DATA = 'SET_USER_DATA';
export const REQUEST_ITEMS = 'REQUEST_ITEMS';
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS';

// ====================================================== //
//  OTHER CONSTANTS
// ====================================================== //
export const PinFilters = {
    SHOW_ALL: 'SHOW_ALL',
    PINNED_ONLY: 'PINNED_ONLY'
}

export const CategoryFilters = {
    SHOW_ALL: 'SHOW_ALL',
    APPLIANCES: 'APPLIANCES',
    AUTO: 'AUTO',
    MEALS: 'MEALS',
    MEDICAL: 'MEDICAL',
    MISCELLANEOUS: 'MISCELLANEOUS'
}

export const ItemTypeFilters = {
    SHOW_ALL: 'SHOW_ALL',
    TASK: 'TASKS',
    EVENT: 'EVENTS',
    DOCUMENT: 'DOCUMENTS'
}

export const GroupFilters = {
    SHOW_ALL: 'SHOW_ALL',
    USER_ONLY: 'USER_ONLY',
    GROUP_ONLY: 'GROUP_ONLY',
    MULTI_GROUP: 'MULTI_GROUP'
}

// ====================================================== //
//  ACTION CREATORS
// ====================================================== //
export const setPinFilter = filter => ({
    type: 'SET_PIN_FILTER',
    filter
})

export const setCategoryFilter = filter => ({
    type: 'SET_CATEGORY_FILTER',
    filter
})

export const setItemTypeFilter = filter => ({
    type: 'SET_ITEMTYPE_FILTER',
    filter
})

export const setGroupFilter = filter => ({
    type: 'SET_GROUP_FILTER',
    filter
})

// set user selfIds and groupIds
export const setUserData = data => ({
    type: 'SET_USER_DATA',
    userData: {
        username: data.username,
        userId: data.userId,
        selfGroupId: data.selfGroupId,
        groupList: data.groupList
    }
})

export const getUserData = () => ({
    type: 'GET_USER_DATA'
})

// function requestItems(itemType) {
//     return {
//         type: REQUEST_ITEMS,
//         itemType
//     }
// }

// function receiveItems(itemType, json) {
//     return {
//         type: RECEIVE_ITEMS,
//         itemType,
//         posts: json.data.children.map(child => child.data),
//         receivedAt: Date.now()
//     }
// }

// function fetchItems(itemType) {
//     return dispatch => {
//         dispatch(requestItems(itemType))
//         return fetch(`${path}/app/${itemType}`)
//     }
// }