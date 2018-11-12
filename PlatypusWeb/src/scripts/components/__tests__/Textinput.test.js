import React from 'react';
import { shallow, mount, render } from 'enzyme';
// import Login from '../Pages/LoginFortest';
import TextInput from '../Forms/TextInput.js';
// describe what we are testing
describe('Signup Component', () => {
 
  // make our assertion and what we expect to happen 
  it('should render without throwing an error', () => {
    expect(shallow(<TextInput />).find('form').exists())
  })

})