import combineReducers from '../../reducers/rootReducer';
import * as actions from '../../reducers/documentsReducer';
import { defaultState } from '../dataFixtures/fixtures';
import documentsReducer from '../../reducers/documentsReducer';
import { medState } from '../dataFixtures/fixtures';
import { shallow, mount, render } from 'enzyme';
import React from 'react';


describe('Login Form', () =>{

    it('matches the snapshot', () =>{
    // const loginForm = shallow(<LoginForm  {...props} />  );
        const tree = shallow(<documentsReducer />)
        expect(tree).toMatchSnapshot()
    })
  })



describe('documents reducer', () => {
    // console.log(userReducer.debug());
    it('returns the initial state', () => {
      expect(documentsReducer( {},{} )).toEqual({});
    });

    it(' ADD_DOCUMENT ', () =>{
        const startAction = {
            type: actions.ADD_DOCUMENT 
        };
        expect(documentsReducer( {}, startAction)).toEqual({});
    });

    it(' ADD_DOCUMENTS ', () =>{
        const startAction = {
            type: actions.ADD_DOCUMENTS 
        };
        expect(documentsReducer( {}, startAction)).toEqual({});
    });

    it('REMOVE_ALL_DOCUMENTS', () =>{
        const startAction = {
            type: actions.REMOVE_ALL_DOCUMENTS
        };
        expect(documentsReducer({}, startAction)).toEqual({});
    });

    it('REMOVE_DOCUMENT', () =>{
        const startAction = {
            type: actions.REMOVE_DOCUMENT
        };
        expect(documentsReducer({}, startAction)).toEqual({});
    });

    it('UPDATE_DOCUMENT', () =>{
        const startAction = {
            type: actions.UPDATE_DOCUMENT
        };
        expect(documentsReducer({}, startAction)).toEqual({});
        expect(documentsReducer(medState, startAction)).toEqual(medState);
    });
    

});

