import React from 'react';
import { Events } from '../Pages/EventsPage.js';
import {shallow} from 'enzyme';

describe('Events', () =>{
    const events = shallow(<Events />);

    it('should render EventsPage', () => {
        expect(events.find('ForwardRef').exists()).toBe(true);
    });
});