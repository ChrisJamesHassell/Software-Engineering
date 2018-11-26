import React from 'react';
import { shallow, mount, render } from 'enzyme';
import AppNavbar from '../Navbar/AppNavbar';


describe('AppNavbar', () => {

  it('matches the snapshot', () =>{
      const tree = shallow(<AppNavbar />)
      expect(tree).toMatchSnapshot()
  })
})