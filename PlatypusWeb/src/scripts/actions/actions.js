export const setPinFilter = filter => ({
    type: 'SET_PIN_FILTER',
    filter
})

export const PinFilters = {
    SHOW_ALL: 'SHOW_ALL',
    PINNED_ONLY: 'PINNED_ONLY'
}


export const setCategoryFilter = filter => ({
    type: 'SET_CATEGORY_FILTER',
    filter
})

export const CategoryFilters = {
    SHOW_ALL: 'SHOW_ALL',
    APPLIANCES: 'APPLIANCES',
    AUTO: 'AUTO',
    MEALS: 'MEALS',
    MEDICAL: 'MEDICAL'
}

export const setItemTypeFilter = filter => ({
    type: 'SET_ITEMTYPE_FILTER',
    filter
})

export const ItemTypeFilters = {
    SHOW_ALL: 'SHOW_ALL',
    TASK: 'TASKS',
    EVENT: 'EVENTS',
    DOCUMENT: 'DOCUMENTS'
}

export const setGroupFilter = filter => ({
    type: 'SET_GROUP_FILTER',
    filter
})

export const GroupFilters = {
    SHOW_ALL: 'SHOW_ALL',
    USER_ONLY: 'USER_ONLY',
    GROUP_ONLY: 'GROUP_ONLY',
    MULTI_GROUP: 'MULTI_GROUP'
}

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

export const getItems = data => ({
    type: 'GET_ITEMS'
})