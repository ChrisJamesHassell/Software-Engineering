import React from 'react';
import ReactDOM from 'react-dom';
import { TaskList, Tasks } from '../Pages/Tasks.js';
import {shallow, mount } from 'enzyme';
import * as actions from '../Pages/Tasks';

const task= {
    completed:true, 
    description: 'test',
    id: 'ID-10T', 
    name: 'Scotty'
  };


describe('TaskList', () =>{
    const taskList = shallow(<TaskList />);
    // const tasks = shallow(<Tasks {...task } />);
    

    it('should render tasksList', () => {
        // console.log(taskList.debug())
        expect(taskList.find('Fragment').exists()).toBe(true);
    });

    

    describe('TaskList snap', () =>{

        it('matches the snapshot', () =>{
            const tree = shallow(<TaskList />)
            expect(tree).toMatchSnapshot()
        })
    })

});



