import React from 'react';
import ReactDOM from 'react-dom';
import { TaskList, Tasks } from '../Pages/Tasks.js';
import {shallow, mount } from 'enzyme';

const task= {
    completed:true, 
    description: 'test',
    id: 'ID-10T', 
    name: 'Scotty'
  };


describe('Tasks', () =>{
    const taskList = shallow(<TaskList />);
    // const tasks = shallow(<Tasks {...task } />);
    

    it('should render tasksList', () => {
        // console.log(taskList.debug())
        expect(taskList.find('Fragment').exists()).toBe(true);
    });

    
    // it('should render tasks', () => {
    //     console.log(tasks.debug())
    //     expect(tasks.find('my-tasks').exists()).toBe(true);
    // });


});