import * as actions from '../../reducers/userReducer';
import configureStore from 'redux-mock-store'
import { shallow, mount, render } from 'enzyme';
import React from 'react';
import {App} from '../Pages/App';


describe('configureStore', () =>{

    it('matches the snapshot', () =>{
        const tree = shallow(<configureStore />)
        expect(tree).toMatchSnapshot()
    })
  })

  describe('configure store mock ', () => {
    const initialState = {output:100}
    const mockStore = configureStore()
    let store,container
    beforeEach(()=>{
        store = mockStore(initialState)
        container = shallow(< App store={store} /> )  
    })

    it('render the connected component', () => {
        expect(container.length).toEqual(1)
    });


    })

