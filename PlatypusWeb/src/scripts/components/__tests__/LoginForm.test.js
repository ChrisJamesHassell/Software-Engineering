import React from 'react';
import { shallow, mount, render } from 'enzyme';
import LoginForm from '../Forms/LoginForm.js';
import TextInput from '../Forms/TextInput';
import {regex} from '../Forms/LoginForm.js';
import { textInput } from '../dataFixtures/fixtures';

const props = { textInput };


// describe what we are testing
describe('LoginForm', () => {
  const loginForm = shallow(<LoginForm  {...props}/>);
 
  // make our assertion and what we expect to happen 
  it('should render a local LoginForm', () => {
    // console.log(loginForm.debug());
    expect(loginForm.find('form').exists()).toBe(true)
  });

  // it('should render username stuff', () => {
  //   expect(loginForm.find('FormGroup').at(0).props().children).toEqual('User Name');
  // });


  it('should say Enter user name', () =>{
    expect (loginForm.find('TextInput').exists()).toBe(true);
  });
})

  // it('should say Enter user name', () =>{
  //   expect (loginForm.find('TextInput').at(0).props().children).toEqual('userName');
  // });

//   describe('and updating the username', () => {
//     beforeEach(() => {
//         loginForm.find('TextInput').at(0).simulate('change', { target: {value: 'change username'} })
//     });

//     it('updates the username', () => {
//         // console.log(stackForm.state());
//         expect(loginForm.state().title).toEqual('change title');
//     });
// });
// });


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
  