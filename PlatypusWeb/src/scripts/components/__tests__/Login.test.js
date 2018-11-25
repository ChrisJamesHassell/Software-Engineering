import React from 'react';
import { Login } from '../Pages/Login.js';
import {shallow} from 'enzyme';

const props = {
    redirect: false,
    error: '',
    loading: false,
    location : {
        pathname: '/login'}
  };


describe('Login', () =>{

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