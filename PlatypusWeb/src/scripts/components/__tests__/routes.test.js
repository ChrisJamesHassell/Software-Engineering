import { shallow, mount, render } from 'enzyme';
import React from 'react';
import routes from '../../routes';
import { rabbleRouters } from '../dataFixtures/fixtures';


const props = rabbleRouters

describe('router snap ', () =>{

    it('matches the snapshot', () =>{
    // const loginForm = shallow(<LoginForm  {...props} />  );
        const tree = shallow(<routes {...props}/>)
        expect(tree).toMatchSnapshot()
    })



})
