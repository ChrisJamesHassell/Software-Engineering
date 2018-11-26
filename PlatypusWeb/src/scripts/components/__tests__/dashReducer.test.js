import combineReducers from '../../reducers/rootReducer';
import * as actions from '../../reducers/tasksReducer';
import { defaultState } from '../dataFixtures/fixtures';
import { userReducer, 
        itemsReducer,  
        pinFilter, 
        categoryFilter, 
        itemTypeFilter, 
        groupFilter } from '../../reducers/dashReducer';


const dfaltUser = defaultState.user;
const dfalt = defaultState;
const dfaltPinFilter = defaultState.PinFilters;
const pinn = 'PINNED_ONLY';
const dfaltCategory = defaultState.CategoryFilters;
const dfaltItemType = defaultState.ItemTypeFilters;
const dfaltGroup = defaultState.GroupFilters;
const showAll = 'SHOW_ALL';

describe('user reducer', () => {
    it('returns the initial state', () => {
      expect(userReducer( undefined ,{} )).toEqual(dfaltUser);
    });

    it('SET user reducer', () =>{
        const startAction = {
            type: actions.SET_USER_DATA 
        };
        expect(userReducer(dfaltUser, startAction)).toEqual(dfaltUser);
    });

    it('GET user reducer', () =>{
        const startAction = {
            type: actions.SET_PIN_FILTER 
        };
        expect(userReducer(dfaltUser, startAction)).toEqual(dfaltUser);
    });

});
describe('item reducer', () => {

    it('returns the initial state', () => {
        expect(itemsReducer( undefined ,{} )).toEqual(dfalt);
      });
    it('GET item reducer', () =>{
        const startAction = {
            type: actions.SET_CATEGORY_FILTER 
        };
        expect(itemsReducer(dfalt, startAction)).toEqual(dfalt);
    });

});

describe('pinFilter ', () => {

    it('returns the initial state', () => {
        expect(pinFilter( undefined ,{} )).toEqual(pinn);
      });
    it('GET item reducer', () =>{
        const startAction = {
            type: actions.SET_ITEMTYPE_FILTER 
        };
        expect(pinFilter(dfaltPinFilter, startAction)).toEqual(pinn);
    });

});

describe('categoryFilter ', () => {

    it('returns the initial state', () => {
        expect(categoryFilter( undefined ,{} )).toEqual(showAll);
      });
    it('GET item reducer', () =>{
        const startAction = {
            type: actions.SET_GROUP_FILTER 
        };
        expect(categoryFilter(dfaltCategory, startAction)).toEqual(showAll);
    });

});

describe('itemTypeFilter ', () => {

    it('returns the initial state', () => {
        expect(itemTypeFilter( undefined ,{} )).toEqual(showAll);
      });
    it('GET item reducer', () =>{
        const startAction = {
            type: actions.GET_ITEMS 
        };
        expect(itemTypeFilter(dfaltItemType, startAction)).toEqual(showAll);
    });

});

describe('groupFilter ', () => {

    it('returns the initial state', () => {
        expect(groupFilter( undefined ,{} )).toEqual(showAll);
      });
    it('GET item reducer', () =>{
        const startAction = {
            type: actions.GET_ITEMS 
        };
        expect(groupFilter(dfaltGroup, startAction)).toEqual(showAll);
    });

});
