import React from 'react';
import ReactDOM from 'react-dom';
import { TaskList } from '../Pages/Tasks.js';
import {shallow} from 'enzyme';

describe('Events', () =>{
    const taskList = shallow(<TaskList />);

    it('should render tasks', () => {
        // console.log(taskList.debug())
        expect(taskList.find('Fragment').exists()).toBe(true);
    });
});