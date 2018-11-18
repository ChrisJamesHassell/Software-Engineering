// import { connect } from 'react-redux';
// import React, { PureComponent, createRef } from 'react'
import React from 'react'
// import PropTypes from 'prop-types'
// import day from 'dayjs'
import { Modal } from 'react-bootstrap';
// import Calendar from 'react-calendar';
// import BaseCalendar from 'tui-calendar';
// import NavIcons from '../../../images/icons/NavIcons';
// import { categories } from '../../fetchHelpers';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import EventForm from '../Forms/EventForm';


// import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'

import 'react-big-calendar/lib/addons/dragAndDrop/styles.less'
import 'react-big-calendar/lib/css/react-big-calendar.css'
const localizer = BigCalendar.momentLocalizer(moment)

const events = [
    {
        id: 0,
        title: 'Board meeting',
        start: new Date(2018, 10, 29, 9, 0, 0),
        end: new Date(2018, 10, 29, 13, 0, 0),
        resourceId: 1,
        isSelf: false,
    },
    {
        id: 1,
        title: 'MS training',
        allDay: true,
        start: new Date(2018, 10, 29, 14, 0, 0),
        end: new Date(2018, 10, 29, 16, 30, 0),
        resourceId: 2,
        isSelf: false,
    },
    {
        id: 2,
        title: 'Team lead meeting',
        start: new Date(2018, 10, 29, 8, 30, 0),
        end: new Date(2018, 10, 29, 12, 30, 0),
        resourceId: 3,
        isSelf: true,
    },
    {
        id: 11,
        title: 'Birthday Party',
        start: new Date(2018, 10, 30, 7, 0, 0),
        end: new Date(2018, 10, 30, 10, 30, 0),
        resourceId: 4,
        isSelf: true,
    },
]

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

export class Events extends React.Component {
    constructor(...args) {
        super(...args)

        this.state = {
            events: events,
            modal: '',
            show: false,
            data: {},
        }
        this.addEvent = this.addEvent.bind(this);
        // this.handleModal = this.handleModal.bind(this);
    }

    handleSelect = (props) => {
        console.log('h==handle select:', props);
        const title = "new event"; //window.prompt('New Event name')
        const { start, end } = props
        //if (title)
        this.setState({ modal: 'createEvent', show: true, data: props });
    }

    handleEventSelect = (props) => {
        console.log('handleevent slot:', props);

    }

    onHideModal = (modal) => {
        this.setState({modal: null})
    }

    handleClose = () => {
        this.setState({show: false})
    }

    addEvent = (props) => {
        console.log("ADDING: ", props);
        const newEvents =  [
            ...this.state.events,
            props
        ]
        console.log("NEW EVETNS: ", newEvents);
        this.setState({
            events: newEvents,
        })
        this.onHideModal();
        this.handleClose();

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
                    visible={this.state.show && this.state.modal === 'createEvent'} 
                    onHideModal={this.onHideModal} 
                    handleClose={this.handleClose}
                    data={this.state.data}
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

/*const MyCalendar = props => (
    <div style={{height: '100%'}}>
      <BigCalendar
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
      />
    </div>
  )

export class Events extends React.Component{
    state = {}
    render() {
        return (
            <div style={{height: '100%'}}>
                <MyCalendar />
            </div>
        )
    }
}
*/
// export class Events extends React.Component {
//     state = {
//         schedules: [
//             {
//                 id: '1',
//                 calendarId: '1',
//                 title: 'my schedule',
//                 category: 'time',
//                 dueDateClass: '',
//                 start: '2018-07-18T22:30:00+09:00',
//                 end: '2018-07-19T02:30:00+09:00'
//             },
//             {
//                 id: '2',
//                 calendarId: '1',
//                 title: 'second schedule',
//                 category: 'time',
//                 dueDateClass: '',
//                 start: '2018-07-18T17:30:00+09:00',
//                 end: '2018-07-19T17:31:00+09:00'
//             }
//         ]
//     }
//     addSchedule = () => {
//         this.setState(({schedules}) => ({schedules: [...schedules, {
//                 id: '2',
//                 calendarId: '1',
//                 title: 'second schedule',
//                 category: 'time',
//                 dueDateClass: '',
//                 start: '2018-07-18T17:30:00+09:00',
//                 end: '2018-07-19T17:31:00+09:00'
//             }]}))
//     }
//     render() {
//         return (
//             <div>
//                 <button onClick={this.addSchedule}>Add schedule</button>
//                 <TuiCalendar
//                     schedules={this.state.schedules}
//                 />
//             </div>
//         )
//     }
// }

// const EVENT_TYPES = [
//     'beforeCreateSchedule',
//     'afterRenderSchedule',
//     'beforeUpdateSchedule',
//     'beforeDeleteSchedule',
//     'clickSchedule',
//     'clickDayname'
//   ]

//   function getTimeTemplate(schedule, isAllDay) {
//     const html = []
//     const start = day(schedule.start.toUTCString())
//     if (!isAllDay) {
//       html.push('<strong>' + start.format('HH:mm') + '</strong> ')
//     }
//     if (schedule.isPrivate) {
//       html.push('<span class="calendar-font-icon ic-lock-b"></span>')
//       html.push(' Private')
//     } else {
//       if (schedule.isReadOnly) {
//         html.push('<span class="calendar-font-icon ic-readonly-b"></span>')
//       } else if (schedule.recurrenceRule) {
//         html.push('<span class="calendar-font-icon ic-repeat-b"></span>')
//       } else if (schedule.attendees.length > 0) {
//         html.push('<span class="calendar-font-icon ic-user-b"></span>')
//       } else if (schedule.location) {
//         html.push('<span class="calendar-font-icon ic-location-b"></span>')
//       }
//       html.push(' ' + schedule.title)
//     }

//     return html.join('')
//   }

//   class TuiCalendar extends PureComponent {
//     calRef = createRef()

//     componentDidMount() {
//       this.calendar = new BaseCalendar(this.calRef.current, {
//         defaultView: 'month',
//         taskView: true,
//         useCreationPopup: true,
//         useDetailPopup: true,
//         timezones: [{
//           timezoneOffset: 420,
//           displayLabel: 'GMT+08:00',
//           tooltip: 'Hong Kong'
//         }],
//         template: {
//           monthGridHeader(model) {
//             const date = new Date(model.date)
//             const template = '<span class="tui-full-calendar-weekday-grid-date">' + date.getDate() + '</span>'
//             return template
//           },
//           milestone(model) {
//             return '<span class="calendar-font-icon ic-milestone-b"></span> <span style="background-color: ' + model.bgColor + '">' + model.title + '</span>'
//           },
//           allday(schedule) {
//             return getTimeTemplate(schedule, true)
//           },
//           time(schedule) {
//             return getTimeTemplate(schedule, false)
//           }
//         },
//         ...this.props.options
//       })
//       this.registerEvents()
//       this.renderCal()
//     }

//     componentDidUpdate(prevProps) {
//       // Unbind and rebind changed event listeners
//       EVENT_TYPES.map(event => {
//         if (this.props[event] !== prevProps[event]) {
//           this.calendar.off(event)
//           this.calendar.on(event, this.props[event])
//         }
//       })
//       this.renderCal()
//     }

//     componentWillUnmount() {
//       this.calendar.destroy()
//     }

//     registerEvents() {
//       this.calendar.on(
//         EVENT_TYPES.reduce(
//           (handlers, event) => ({...handlers, [event]: this.props[event]}),
//           {}
//         )
//       )
//     }

//     renderCal() {
//       this.calendar.clear()
//       this.calendar.createSchedules(this.props.schedules)
//       this.calendar.render()
//     }

//     // fireMethod(method, ...args) {
//     //   return this.calendar[method](...args)
//     // }

//     render() {
//       return <div ref={this.calRef} style={{height: 800}}/>
//     }
//   }

//   TuiCalendar.defaultProps = {
//     schedules: [],
//     options: {},
//     ...EVENT_TYPES.reduce((acc, event) => ({...acc, [event]: () => {}}), {})
//   }

//   TuiCalendar.propTypes = {
//     schedules: PropTypes.array,
//     options: PropTypes.object,
//     ...EVENT_TYPES.reduce((acc, event) => ({...acc, [event]: PropTypes.func}), {})
//   }