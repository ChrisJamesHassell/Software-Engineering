import React from 'react';
import { shallow, mount, render } from 'enzyme';
import {App} from '../Pages/App';



describe('App SnapShot', () => {

  it('matches the snapshot', () =>{
      const tree = shallow(<App />)
      expect(tree).toMatchSnapshot()
  })
})


describe('App', () =>{
    const app = shallow(<App />);

    it('should render App', () => {
        expect(app.find('div').exists()).toBe(true);
    });
});



// describe ('<App />', () => {
//     it('should render App', () => {
//         const wrapper = shallow(<App />)
//         // console.log(wrapper.debug())
//         // expect(wrapper.find('App').hasClass('container')).toBe(true)
//     })
//     it('matches the snapshot', () =>{
//         const tree = shallow(<App />)
//         expect(tree).toMatchSnapshot()
//     })
// })

// import Adapter from 'enzyme-adapter-react-16'
// configure({ adapter: new  Adapter()})

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<App />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });