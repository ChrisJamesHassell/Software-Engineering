import React from 'react';
import ReactDOM from 'react-dom';
import { Login } from '../Pages/Login.js';
import {shallow} from 'enzyme';

const props = {
    thing: {isLogin: '/login'}
};
// describe('Login', () =>{
//     const login = shallow(<Login {...props} />  );

//     it('should render Login', () => {
//         console.log(login.debug())
//         // expect(login.find('div').exists()).toBe(true);
//     });
// });