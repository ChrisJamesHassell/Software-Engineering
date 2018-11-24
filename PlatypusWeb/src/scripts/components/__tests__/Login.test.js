import React from 'react';
import ReactDOM from 'react-dom';
import { Login } from '../Pages/Login.js';
import {shallow} from 'enzyme';
import renderer from 'react-test-renderer';

// const props = {
//     thing: {isLogin: true}
// };\

const props = {
    redirect: false,
    error: '',
    loading: false,
    location : {
        pathname: '/login'}
  };

// const isLogin = props.location.pathname === '/login';

describe('Login', () =>{
    // const login = shallow(<Login  {...props} />  );
    // it('should render Login', () => {
    //     // const wrapper = shallow(<App />)
    //     // console.log(wrapper.debug())
    //     // expect(wrapper.find('App').hasClass('container')).toBe(true)
    // })
    it('matches the snapshot', () =>{
        const tree = shallow(<Login  {...props}/>)
        expect(tree).toMatchSnapshot()
    })
})




describe('Login', () =>{
    const login = shallow(<Login  {...props} />  );


    it('should render Login Container', () => {
        expect(login.find('#login-container').exists()).toBe(true);
    });
    it('should render Grid', () => {
        expect(login.find('#row-container').exists()).toBe(true);
    });
    it('should render Login Links', () => {
        expect(login.find('#login-links').exists()).toBe(true);
    });
    it('should render button1', () => {
        expect(login.find('Button').at(0).exists()).toBe(true);
    });
    it('should render button2', () => {
        expect(login.find('Button').at(1).exists()).toBe(true);
    });
    
    


});