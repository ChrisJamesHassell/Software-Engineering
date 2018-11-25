export const textInput = {
    state : {
        value: 'testVal',
        requiresValidation: false
    }
};

export const task = {
    index: 0,
    onTaskClick : true,
    onTaskComplete: false,
    onTaskDeleteClick: false,
    onTaskEditClick:false,
    task: {
      completed: true, description: 'Pay up', id: 0, name: 'Vinny',
    }
};

export const defaultState = {
    pinFilter: 'SHOW_ALL', // PINNED_ONLY
    categoryFilter: 'SHOW_ALL', // 'APPLIANCES', 'AUTO', 'MEALS', 'MEDICAL'
    itemTypeFilter: 'SHOW_ALL', // 'TASKS', 'EVENTS', 'DOCUMENTS',
    groupFilter: 'USER_ONLY', // USER_ONLY, GROUP_ONLY, MULTI_GROUP
    user: { // returned from the Login/Create API call
        username: null,
        userId: null,
        selfGroupId: null,
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

export const medState = {
    Medical: [
      {
        docID: 1,
        name: 'Dental Insurance',
        description: 'BlueCross',
        category: 'Medical',
        filename: 'IMG-12345.PNG',
        expiryDate: '2018-10-29T21:29:56.940Z',
      },
    ],
  }

  export const eventState = {
      Miscellaneous: [
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
    }

    // {"categoryFilter": "SHOW_ALL", "documents": {"Medical": [{"category": "Medical", "description": "BlueCross", "docID": 1, "expiryDate": "2018-10-29T21:29:56.940Z", "filename": "IMG-12345.PNG", "name": "Dental Insurance"}]}, "events": {"Miscellaneous": [{"category": "Miscellaneous", "description": "Event Description", "end": "2018-10-29T21:29:56.940Z", "eventID": 1, "location": "That one place", "name": "Event Name", "start": "2018-10-29T21:29:48.475Z"}]}, "groupFilter": "SHOW_ALL", "itemTypeFilter": "SHOW_ALL", "pinFilter": "PINNED_ONLY", "tasks": {}, "user": {"groupList":[{}], "selfGroupId": null, "userId": null, "username": null}}
    