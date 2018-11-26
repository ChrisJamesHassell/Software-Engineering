import React from 'react';
import { shallow, mount, render } from 'enzyme';
// import Login from '../Pages/LoginFortest';
import SignupForm from '../Forms/SignupForm.js';
// describe what we are testing
describe('Signup Component', () => {

  const signUp = shallow(<SignupForm />);
 
  // make our assertion and what we expect to happen 
  it('should render without throwing an error', () => {
    expect(signUp.find('form').exists()).toBe(true)
  })

})