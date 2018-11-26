import React from 'react';
import { shallow, mount, render } from 'enzyme';
import TaskForm from '../Forms/TaskForm';

const props = { 
    category: null,
    deadline: '',
    description: '',
    name: '',
    priority: null,
  };

describe('TaskForm', () =>{
    const taskForm = shallow(<TaskForm  />  );


    it('should render Login Container', () => {
        expect(taskForm.find('Formik').exists()).toBe(true);
    });



describe('TaskForm', () =>{

    it('matches the snapshot', () =>{
        const tree = shallow(<TaskForm />)
        expect(tree).toMatchSnapshot()
        })
    })
})
