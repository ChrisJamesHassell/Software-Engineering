import React from 'react';
import { shallow, mount, render } from 'enzyme';
import TextInput from '../Forms/TextInput';
import { textInput } from '../dataFixtures/fixtures';

const props = { textInput };

describe('TextInput should do a thing', () => {
    const textInput = shallow(<TextInput {...props} />);

    it('renders the TextInput stuff', () =>{
        expect(textInput.find('FormControl').exists()).toBe(true);
    })
});