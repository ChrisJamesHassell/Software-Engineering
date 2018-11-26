import * as actions from '../../reducers/tasksReducer';
import eventsReducer, { sortByStartDate } from '../../reducers/eventsReducer';
import { eventState } from '../dataFixtures/fixtures';


const props = eventState ;


describe('events reducer', () => {
    it('returns the initial state', () => {
      expect(eventsReducer( {},{} )).toEqual({});
    });

    it(' ADD_EVENT ', () =>{
        const startAction = {
            type: actions.ADD_EVENT 
        };
        expect(eventsReducer( props, startAction)).toEqual(props);
    });

      it(' REMOVE_ALL_EVENTS ', () =>{
          const startAction = {
              type: actions.REMOVE_ALL_EVENTS 
          };
          expect(eventsReducer( {}, startAction)).toEqual({});
      });
      
      it(' REMOVE_EVENTS ', () =>{
        const startAction = {
            type: actions.REMOVE_EVENTS 
        };
        expect(eventsReducer( {}, startAction)).toEqual({});
    });

    it(' UPDATE_EVENTS ', () =>{
        const startAction = {
            type: actions.UPDATE_EVENTS 
        };
        expect(eventsReducer( {}, startAction)).toEqual({});
    });

});

