import React from 'react';
import { shallow } from 'enzyme';
import axios from 'axios';
import Purchase from '../../Components/Purchase/Purchase';

jest.mock('axios');

describe('when the home component is called', () => {
    let wrapper;

    beforeEach(() => {
        axios.get.mockResolvedValue({
            status: 200,
            data: {
                status: 'SUCCESS',
                data: []
            }
        });

        axios.post.mockResolvedValue({
            status: 200,
            data: {
                status: 'SUCCESS',
                totalPrice: 100
            }
        });

        wrapper = shallow(<Purchase />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the render method', () => {
        expect(wrapper).toHaveLength(1);
    });

    it('should render the 1 button', () => {
        expect(wrapper.find('button')).toHaveLength(2);
    });

    it('should have called handle click book function', () => {
        const spy = jest.spyOn(wrapper.instance(), 'handleSubmit');

        wrapper.instance().forceUpdate();

        wrapper.find('#submit').simulate('click', {
            preventDefault: () => {}
        });

        expect(spy).toHaveBeenCalled();
    });
});
