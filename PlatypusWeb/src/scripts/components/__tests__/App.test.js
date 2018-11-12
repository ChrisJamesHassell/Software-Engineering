import React from 'react';
import ReactDOM from 'react-dom';
import App from '../Pages/App.js';
import {shallow} from 'enzyme';


describe ('<App />', () => {
    it('should render App', () => {
        const wrapper = shallow(<App />)
        // console.log(wrapper.debug())
        // expect(wrapper.find('App').hasClass('container')).toBe(true)
    })
    it('matches the snapshot', () =>{
        const tree = shallow(<App />)
        expect(tree).toMatchSnapshot()
    })
})

// import Adapter from 'enzyme-adapter-react-16'
// configure({ adapter: new  Adapter()})

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });