import React from 'react';
import ReactDOM from 'react-dom';
import { Dash, DashBoxBody, DashBoxHeader, DashBox } from '../Pages/DashPage.js';
import { shallow } from 'enzyme';


describe ('<Dash/>', () => {
    const dash = shallow(<Dash />);
    const dashBoxBody = shallow(<DashBoxBody />);
    const dashBoxHeader = shallow(<DashBoxHeader />);


    it('should render Dash', () => {
        expect(dash.find('div').exists()).toBe(true);
    });

    it('should render dashBoxBody', () => {
        expect(dashBoxBody.find('div').exists()).toBe(true);
    });

    it('should render dashBoxHeader', () => {
        expect(dashBoxHeader.find('div').exists()).toBe(true);
    });



})