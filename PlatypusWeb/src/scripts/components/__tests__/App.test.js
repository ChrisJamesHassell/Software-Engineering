import React from 'react';
import { shallow, mount, render } from 'enzyme';
import {App} from '../Pages/App';



describe('App SnapShot', () => {

  it('matches the snapshot', () =>{
      const tree = shallow(<App />)
      expect(tree).toMatchSnapshot()
  })
})


describe('App', () =>{
    const app = shallow(<App />);

    it('should render App', () => {
        expect(app.find('div').exists()).toBe(true);
    });
});








