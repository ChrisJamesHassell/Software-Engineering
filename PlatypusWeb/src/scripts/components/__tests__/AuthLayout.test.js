import React from 'react';
import { shallow, mount, render } from 'enzyme';
import { LeftNavInner } from '../Layouts/AuthLayout';

const props = { 
    route: {
        path: '/login'}
};

describe('LeftNavInner', () => {

  it('matches the snapshot', () =>{
      const tree = shallow(<LeftNavInner {...props} />)
      expect(tree).toMatchSnapshot()
  })
})