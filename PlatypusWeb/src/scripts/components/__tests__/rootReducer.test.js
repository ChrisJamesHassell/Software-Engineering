import combineReducers from '../../reducers/rootReducer';
import * as actions from '../../reducers/documentsReducer';
import { defaultState } from '../dataFixtures/fixtures';
import rootReducer from '../../reducers/rootReducer';
import { medState } from '../dataFixtures/fixtures';
import { shallow, mount, render } from 'enzyme';
import React from 'react';

// const props = documentsReducer.state ;
// const props1 = { combineReducers }
describe('Login Form', () =>{

    it('matches the snapshot', () =>{
    // const loginForm = shallow(<LoginForm  {...props} />  );
        const tree = shallow(<rootReducer />)
        expect(tree).toMatchSnapshot()
    })
  })



// describe('root reducer', () => {
//     // console.log(userReducer.debug());
//     it('returns the initial state', () => {
//       expect(rootReducer( defaultState,{} )).toEqual(defaultState);
//     });

    // it(' ADD_DOCUMENT ', () =>{
    //     const startAction = {
    //         type: actions.ADD_DOCUMENT 
    //     };
    //     expect(documentsReducer( {}, startAction)).toEqual({});
    // });
    // const props = { textInput };

    

// });

