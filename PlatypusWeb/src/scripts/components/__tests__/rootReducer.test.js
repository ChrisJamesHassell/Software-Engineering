
import { shallow, mount, render } from 'enzyme';
import React from 'react';

describe('Login Form', () =>{

    it('matches the snapshot', () =>{
        const tree = shallow(<rootReducer />)
        expect(tree).toMatchSnapshot()
    })
  })



