import React from 'react';
import ReactDOM from 'react-dom';
import { Events } from '../Pages/EventsPage.js';
import {shallow} from 'enzyme';

describe('Events', () =>{
    const events = shallow(<Events />);

    it('should render EventsPage', () => {
        // console.log(events.debug())
        expect(events.find('ForwardRef').exists()).toBe(true);
    });
});