import React from 'react'
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import qs from 'qs';
import EventForm from '../Forms/EventForm';
import { path, categoryColor } from '../../fetchHelpers';
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
            method: '',
            currentId: null,
            currentStart: null,
            currentEnd: null
        }
        this.addEvent = this.addEvent.bind(this);
    }

    fetchRequest = async (url, method, body, isEdit = false) => {
        let options = {
            method: method,
            credentials: 'include'
        }

        if (body) options['body'] = JSON.stringify(body);

        await fetch(url, options)
            .then(response => this.validateResponse(response))
            .then(validResponse => validResponse.json())
            .then(jsonResponse => this.handleJsonResponse(jsonResponse, isEdit))
    }

    componentDidMount() {
        this.setState({ method: 'GET' });
        const url = `${path}/app/event?${qs.stringify({
            category: 'null',
            groupID: localStorage.getItem('selfGroupId'),
            pinned: 'null',
            userID: localStorage.getItem('userId'),
            weeksAhead: -1,
        })}`;

        this.fetchRequest(url, 'GET', null)
    }

    getFormattedItem = (item) => {
        return {
            id: item.itemID,
            start: moment(item.start).add(2, 'hours').toDate(),
            end: moment(item.end).add(2, 'hours').toDate(),
            title: item.name,
            isSelf: true,
            data: {
                category: item.category,
                description: item.description,
                eventID: item.itemID,
                location: item.location,
                name: item.name,
                notification: item.notification ? moment(item.notification).format('YYYY-MM-DD') : '',
                startDate: moment(item.start).format('YYYY-MM-DD'),
                endDate: moment(item.end).format('YYYY-MM-DD'),
                pinned: item.pinned ? 1 : 0
            }
        }
    }

    // === HANDLECLOSE === //
    handleClose = () => {
        this.setState({ show: false })
    }

    // === HANDLESELECT === // For creating a new event
    handleSelect = (props) => {
        this.setState({ modal: 'Create', show: true, data: props, currentStart: props.start, currentEnd: props.end });
    }

    // === HANDLEEVENTSELECT === // For editing an existing event
    handleEventSelect = (props) => {
        this.setState({ modal: 'Edit', show: true, data: props })
    }

    // === HANDLESUBMISSION === //
    handleSubmission = (props, modal) => {
        if (modal === 'Create') this.addEvent(props);
        else this.editEvent(props, modal === 'Edit');
    }

    // === HANDLEDELETE === //
    onDelete = (props, modal) => {
        this.setState({ currentId: props.event.eventID, method: 'POST' });
        const url = `${path}/app/event/delete`;
        this.fetchRequest(url, 'POST', props, true);
        this.handleClose();
    }

    // === ADDEVENT === //
    addEvent = (props) => {
        const url = `${path}/app/event/add`;
        const request = {
            group: { groupID: localStorage.getItem('selfGroupId') },
            event: { ...props.data, pinned: props.data.pinned ? 1 : 0 },
        }

        this.fetchRequest(url, 'POST', request);
        this.handleClose();
    }

    // === EDITEVENT === //
    editEvent = (props, isEdit) => {
        this.setState({ method: 'POST' });
        const url = `${path}/app/event/update`;
        const request = { event: { ...props } }

        this.fetchRequest(url, 'POST', request, isEdit);
        this.handleClose();
    }

    // === HANDLEEDIT === //
    handleEdit = (event, isDelete = false) => {
        let editedIndex = null;
        let events = this.state.events;

        if (isDelete) { // For DELETION
            editedIndex = event;
            events = events.filter(item => item.id !== editedIndex);
        }

        else { // For MODIFY
            this.state.events.forEach((item, index) => { if (item.id === event.id) editedIndex = index; });
            events[editedIndex] = event;
        }
        return events;
    }

    // === VALIDATERESPONSE === //
    validateResponse = (result) => {
        if (!result.ok) throw Error(result.statusText);
        return result;
    }

    // === HANDLEJSONRESPONSE === //
    handleJsonResponse(response, isEdit = false) {
        let { data: event } = response;
        let events = [];
        /* TODO: Eventually, we need to allow TIME to be saved in the database
            so that the "weekly" and "daily" views show the correct span and PERSIST it
        */
        if (this.state.method === 'GET') { // Then it's an initial GET request which will return multiple events
            this.setState({ method: '' });  // Reset it
            if (event.length < 1) events = []; // Make sure we have events before doing any work
            else {
                event.forEach(item => {
                    events.push(this.getFormattedItem(item.event));
                })
            }
        }

        else {
            this.setState({ method: '' }); // Reset method
            if (this.state.currentStart) event = { ...event, start: this.state.currentStart, end: this.state.currentEnd };
            const formattedEvent = this.getFormattedItem(event);
            this.setState({ currentStart: null, currentEnd: null });
            if (isEdit) {
                if (response.message.includes('delete')) events = this.handleEdit(this.state.currentId, true);
                else events = this.handleEdit(formattedEvent);
            }
            else events = [...this.state.events, formattedEvent]; // Adding an event
        }
        this.setState({ events });
    }

    eventStyleGetter = (event) => {
        var style = {
            backgroundColor: categoryColor[event.data.category],
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white',
            border: '0px',
            display: 'block',
            fontWeight: 600
        };

        return {
            style: style
        };
    }

    render() {
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <EventForm
                    visible={this.state.show}
                    modal={this.state.modal}
                    handleClose={this.handleClose}
                    data={this.state.data}
                    // formData={this.state.data.data}
                    events={this.state.events}
                    onDelete={this.onDelete}
                    handleSubmission={this.handleSubmission}
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
                    eventPropGetter={event => this.eventStyleGetter(event)}
                />

            </div>

        )
    }
}