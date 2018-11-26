import combineReducers from '../../reducers/rootReducer';
import * as actions from '../../reducers/tasksReducer';
import { defaultState } from '../dataFixtures/fixtures';
import tasksReducer from '../../reducers/tasksReducer';

const props = { defaultState };
const props1 = { combineReducers }


describe('task reducer', () => {
    it('returns the initial state', () => {
      expect(tasksReducer( {},{} )).toEqual({});
    });
    it('should handle ADD_TASK', () =>{
        const startAction = {
            type: actions.ADD_TASK 
        };
        expect(tasksReducer({}, startAction)).toEqual({});
    });

    it('should handle ADD_TASKS', () =>{
        const startAction = {
            type: actions.ADD_TASKS 
        };
        expect(tasksReducer({}, startAction)).toEqual({});
    });

    it('should handle REMOVE_ALL_TASKS', () =>{
        const startAction = {
            type: actions.REMOVE_ALL_TASKS 
        };
        expect(tasksReducer({}, startAction)).toEqual({});
    });
    it('should handle REMOVE_TASK', () =>{
        const startAction = {
            type: actions.REMOVE_TASK 
        };
        expect(tasksReducer({}, startAction)).toEqual({});
    });


    it('should handle UPDATE_TASK', () =>{
        const startAction = {
            type: actions.UPDATE_TASK 
        };
        expect(tasksReducer({}, startAction)).toEqual({});
    });

});


