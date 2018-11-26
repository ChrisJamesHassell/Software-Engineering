import React from 'react';
import { shallow, mount, render } from 'enzyme';
import AppLogoHeader from '../Navbar/AppLogoHeader';



describe('AppLogoHeader', () => {

  it('matches the snapshot', () =>{
      const tree = shallow(<AppLogoHeader />)
      expect(tree).toMatchSnapshot()
  })
})