import React from 'react';
import { shallow, mount, render } from 'enzyme';
import LoginForm from '../Forms/LoginForm.js';
import { textInput } from '../dataFixtures/fixtures';


const props = { textInput };
describe('Login Form', () =>{
  
  it('matches the snapshot', () =>{
      const tree = shallow(<LoginForm  {...props}/>)
      expect(tree).toMatchSnapshot()
  })
})

