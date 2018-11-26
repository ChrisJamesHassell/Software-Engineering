import * as actions from '../../reducers/userReducer';
import userReducer from '../../reducers/userReducer';
import { shallow, mount, render } from 'enzyme';
import React from 'react';


describe('User reducer', () =>{

    it('matches the snapshot', () =>{
        const tree = shallow(<userReducer />)
        expect(tree).toMatchSnapshot()
    })
  })

  describe('user reducer ', () => {

    it('returns the initial state', () => {
        expect(userReducer( undefined ,{} )).toEqual({});
      });
    it('UPDATE_USER', () =>{
        const startAction = {
            type: actions.UPDATE_USER 
        };
        expect(userReducer(undefined ,startAction )).toEqual({});
    });

});