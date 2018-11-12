import React from 'react';
import { shallow, mount, render } from 'enzyme';
// import Login from '../Pages/LoginFortest';
import LoginForm from '../Forms/LoginForm.js';
import TextInput from '../Forms/TextInput';
import {regex} from '../Forms/LoginForm.js';

// describe what we are testing
describe('Login Component', () => {
 
  // make our assertion and what we expect to happen 
  it('should render without throwing an error', () => {
    expect(shallow(<LoginForm />).find('form').exists()).toBe(true)
  })

  // test('regexWorks', () =>{
  //   expect.stringMatching( /^(?=.*[a-zA-Z])[A-Za-z\d]{8,32}$/g).not.toMatch( 'alllowercase');
// });
});


  // it('renders a password input', () => {
  //   expect(shallow(<TextInput />).find('#User Name').exists()).toBe(true)
  // })

// })
// test('there should not be all lower', () => {
//   expect ('teamI').not.toMatch(/I/);
// });

// describe ('<TextInput />', () => {
//   it('userName accepts id prop', () => {
//     const wrapper = shallow(<TextInput )
//   })