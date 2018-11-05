// Synchronous
/*
        "appliances": Appliances,
        "auto": Auto,
        "dashboard": Dashboard,
        "events": Events,
        "meals": Meals,
        "medical": Medical,
        "tasks": Tasks
        ============
        itemTypes: TASK, EVENT, DOCUMENT
*/
// DASHBOARD
// setting filters
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
    username: data.username,
    userId: data.userId,
    selfGroupId: data.selfGroupId,
    groupList: data.groupList
})

export const getUserData = () => ({
    type: 'GET_USER_DATA'
})

export const getItems = data => ({
    type: 'GET_ITEMS' //,
    // request: {
    //     method: 'GET',
    //     headers: {
    //         'Content-type': 'application/json'
    //     },
    //     body: JSON.stringify(data.body)
    // },
    // path: data.path
})
// export const setUserId = id => ({
//     type: 'SET_USERID',
//     id
// })

// export const setUsername = username => ({
//     type: 'SET_USERNAME',
//     username
// })

// export const setGroupId = groupId => ({
//     type: 'SET_GROUPID',
//     groupId
// })

// export const setGroupList = groupList => ({
//     type: 'SET_GROUPLIST',
//     groupList
// })

// get data

// -- state shape
/*
{
    pinFilter: 'SHOW_ALL', // PINNED_ONLY
    categoryFilter: 'SHOW_ALL', // 'APPLIANCES', 'AUTO', 'MEALS', 'MEDICAL'
    itemTypeFilter: 'SHOW_ALL', // 'TASK', 'EVENT', 'DOCUMENT',
    groupId: 24,
    userId: 24,
    groupList: [24],
    maxItems: 10
    items: [
        {
            type: 'TASK',
            id: 0,
            name: 'task01',
            pinned: true,
            description: 'description for task 1',
            category: 'MEDICAL',
            data: {
                startDate: ...,
                endDate: ...,
                location: ...
            }
        },
                {
            type: 'EVENT',
            id: 0,
            name: 'event01',
            pinned: true,
            description: 'description for event 1',
            category: 'AUTO',
            data: {
                deadline: ...,
                priority: ...,
                completed: ...
            }
        },
                {
            type: 'DOCUMENT',
            id: 0,
            name: 'task01',
            pinned: true,
            description: 'description for task 1',
            category: 'MEDICAL',
            data: {
                fileName: ...,
                expirationDate: ...
            }
        }
    ]
}
*/

