import React from 'react'
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import qs from 'qs';
import EventForm from '../Forms/EventForm';
import { path } from '../../fetchHelpers';
import { getRandomId } from '../../fetchHelpers';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'
import 'react-big-calendar/lib/css/react-big-calendar.css'
const localizer = BigCalendar.momentLocalizer(moment)

// let MyOtherNestedComponent = () => <div>NESTED COMPONENT</div>
// const resourceMap = [
//     { resourceId: 1, resourceTitle: 'Board room' },
//     { resourceId: 2, resourceTitle: 'Training room' },
//     { resourceId: 3, resourceTitle: 'Meeting room 1' },
//     { resourceId: 4, resourceTitle: 'Meeting room 2' },
// ]
// let MyCustomHeader = ({ label }) => (
//     <div>
//         CUSTOM HEADER:
//     <div>{label}</div>
//         <MyOtherNestedComponent />
//     </div>
// )


// REQUEST NEEDS TO LOOK LIKE:
/*
{
	"group":{
		"groupID": 24
	},
	"event":{
		"category": "APPLIANCES",
		"description": "sdfsdf",
		"name": "eventhurr",
		"notification": "1111-11-11",
		"startDate":"1111-11-11",
		"endDate": "1111-11-11",
		"location":"",
		"pinned": 1
	}
}
*/
export class Events extends React.Component {
    constructor(...args) {
        super(...args)

        this.state = {
            events: [],
            modal: '',
            show: false,
            data: {},
        }
        this.addEvent = this.addEvent.bind(this);
    }

    async componentDidMount() {
        const response = await fetch(`${path}/app/event?${qs.stringify({
            category: 'null',
            groupID: localStorage.getItem('selfGroupId'),
            pinned: 'null',
            userID: localStorage.getItem('userId'),
            weeksAhead: -1,
        })}`, {
                method: 'GET',
                credentials: 'include',
            });

        const { data: items } = await response.json();
        let formatItems = []
        items.map(item => formatItems.push(item.event))
        formatItems = this.getFormattedItems(formatItems);
        this.setState({ events: formatItems })

    }

    getFormattedItems = (props) => {
        let formattedItems = [];
        props.forEach(item => {

            formattedItems.push({
                id: item.itemID,
                start: moment(item.start).add(2, 'hours').toDate(),
                end: moment(item.end).add(2, 'hours').toDate(),
                title: item.name,
                isSelf: true,
                data: {
                    ...item,
                    startDate: item.start, //start,
                    endDate: item.end, //end,
                    pinned: item.pinned ? 1 : 0
                }
            })
        });
        return formattedItems;
    }

    handleSelect = (props) => {
        this.setState({ modal: 'Create', show: true, data: props });
    }

    handleEventSelect = (props) => {
        this.setState({ modal: 'Edit', show: true, data: props })
        console.log('handleevent slot:', props);
    }

    // === HANDLECLOSE === //
    handleClose = () => {
        this.setState({ show: false })
    }

    // === ADDEVENT === //
    addEvent = async (props) => {
        let request = {
            group: { groupID: localStorage.getItem('selfGroupId') },
            event: { ...props.data, pinned: props.data.pinned ? 1 : 0 },
        }

        const response = await fetch(`${path}/app/event/add`, {
            body: JSON.stringify(request),
            credentials: 'include',
            method: 'POST',
        })
            .then(response => this.validateResponse(response))
            .then(validResponse => validResponse.json())
            .then(jsonResponse => this.handleJsonResponse(jsonResponse))

        this.handleClose();
    }

    // === VALIDATERESPONSE === //
    validateResponse = (result) => {
        if (!result.ok) throw Error(result.statusText);
        return result;
    }

    // === HANDLEJSONRESPONSE === //
    handleJsonResponse(response) {
        const { data: event } = response;
        const formattedEvent = this.getFormattedItems([event])[0];
        const events = [...this.state.events, formattedEvent];
        this.setState({ events });
    }

    // eventStyleGetter = (event) => {
    //     console.log('event style getter event: ', event);
    //     var backgroundColor = event.isSelf ? 'pink' : 'green';
    //     var style = {
    //         backgroundColor: backgroundColor,
    //         borderRadius: '0px',
    //         opacity: 0.8,
    //         color: 'black',
    //         border: '0px',
    //         display: 'block'
    //     };
    //     return {
    //         style: style
    //     };
    // }



    render() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <EventForm
                    visible={this.state.show}
                    modal={this.state.modal}
                    handleClose={this.handleClose}
                    data={this.state.data}
                    formData={this.state.data.data}
                    events={this.state.events}
                    addEvent={this.addEvent}
                />
                <BigCalendar
                    popup
                    selectable
                    localizer={localizer}
                    events={this.state.events}
                    defaultView={BigCalendar.Views.MONTH}
                    scrollToTime={new Date(1970, 1, 1, 6)}
                    defaultDate={new Date()}
                    onSelectEvent={event => this.handleEventSelect(event)}
                    onSelectSlot={event => this.handleSelect(event)}
                // eventPropGetter={event => this.eventStyleGetter(event)}
                />

            </div>

        )
    }
}