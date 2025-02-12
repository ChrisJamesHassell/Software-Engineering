import moment from 'moment';
import qs from 'qs';
import React, { Fragment } from 'react';
import {
  Button,
  Col,
  Glyphicon,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Panel,
  Row,
} from 'react-bootstrap';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';

import { path } from '../../fetchHelpers';
import TaskForm, { priorityOptions } from '../Forms/TaskForm';

const Task = ({
  index,
  onTaskClick,
  onTaskComplete,
  onTaskDeleteClick,
  onTaskEditClick,
  task: {
    completed, description, id, name,
  },
}) => (
    <Draggable draggableId={id} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="task"
          onClick={onTaskClick}
          ref={provided.innerRef}
        >
          <div style={{ alignItems: 'center', display: 'flex' }}>
            <input
              checked={completed}
              onChange={onTaskComplete}
              style={{ marginLeft: 'calc(1em - 8px)', marginRight: '1em' }}
              type="checkbox"
            />
            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4>{name}</h4>
                <div style={{ display: 'flex' }}>
                  <a href="#edit" onClick={onTaskEditClick} style={{ marginRight: '0.5em' }}>
                    <Glyphicon glyph="pencil" />
                  </a>
                  <a href="#remove" onClick={onTaskDeleteClick}>
                    <Glyphicon glyph="remove" />
                  </a>
                </div>
              </div>
              <p>{description}</p>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

export class TaskList extends React.Component {
  render() {
    const { tasks } = this.props;

    return (
      <Fragment>
        {['HIGH', 'MID', 'LOW'].map((value, index) => {
          const priority = priorityOptions.find(op => op.value === value);

          if (!priority) return null;

          return (
            <Droppable droppableId={`tasks-${priority.label.toLowerCase()}`} key={index}>
              {provided => (
                <div {...provided.droppableProps} className="task-list" ref={provided.innerRef}>
                  <h4>{priority.label}</h4>
                  {tasks
                    .filter(task => task.priority === value)
                    .map(
                      (
                        {
                          onTaskClick,
                          onTaskComplete,
                          onTaskDeleteClick,
                          onTaskEditClick,
                          ...task
                        },
                        taskIndex,
                      ) => (
                          <Task
                            index={taskIndex}
                            key={taskIndex}
                            onTaskClick={onTaskClick}
                            onTaskComplete={onTaskComplete}
                            onTaskDeleteClick={onTaskDeleteClick}
                            onTaskEditClick={onTaskEditClick}
                            task={task}
                          />
                        ),
                    )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          );
        })}
      </Fragment>
    );
  }
}

export class Tasks extends React.Component {
  state = {
    activeModal: null,
  };

  async componentDidMount() {
    const response = await fetch(
      `${path}/app/task?${qs.stringify({
        category: 'null',
        groupID: localStorage.getItem('selfGroupId'),
        pinned: 'null',
        userID: localStorage.getItem('userId'),
        weeksAhead: -1,
      })}`,
      {
        credentials: 'include',
      },
    );
    const { data: tasks } = await response.json();

    this.props.dispatch({
      type: 'REMOVE_ALL_TASKS',
    });
    this.props.dispatch({
      type: 'ADD_TASKS',
      payload: tasks.map(task => task.task),
    });
  }

  changeModal = value => this.setState({ activeModal: value });

  onDragEnd = async (result) => {
    const { tasks } = this.props;
    const { destination, draggableId, source } = result;

    // if Draggable dragged outside of DragDropContext
    if (!destination) {
      return;
    }

    // if same location
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const newPriority = priorityOptions.find(
      // droppableId something like 'tasks-medium'
      op => op.label.toLowerCase() === destination.droppableId.split('-')[1],
    );

    if (!newPriority) return;

    const task = Object.values(tasks)
      .reduce((prev, curr) => [...prev, ...curr], [])
      .find(tsk => tsk.itemID === draggableId);

    if (!task) return;

    await this.onTaskUpdate({
      ...task,
      deadline: moment(task.deadline).format('YYYY-MM-DD'),
      notification: moment(task.notification).format('YYYY-MM-DD'),
      priority: newPriority.value,
    });
  };

  onHideModal = () => this.changeModal(null);

  onTaskComplete = task => () => this.onTaskUpdate({
    ...task,
    completed: !task.completed,
    deadline: moment(task.deadline).format('MMM d, YYYY'),
    notification: moment(task.notification).format('MMM d, YYYY'),
    taskID: task.itemID,
  });

  onTaskCreate = async (values) => {
    const response = await fetch(`${path}/app/task/add`, {
      body: JSON.stringify({
        group: {
          groupID: localStorage.getItem('selfGroupId'),
        },
        task: values,
      }),
      credentials: 'include',
      method: 'POST',
    });
    const { data: task } = await response.json();

    this.props.dispatch({
      type: 'ADD_TASK',
      payload: task,
    });
    this.onHideModal();
  };

  onTaskCreateClick = () => this.changeModal('create-task');

  onTaskDelete = async ({ itemID, category }) => {
    await fetch(`${path}/app/task/delete`, {
      body: JSON.stringify({
        // group: {
        //   groupID: localStorage.getItem('selfGroupId'),
        // },
        task: {
          taskID: itemID,
        },
        // user: {
        //   userID: localStorage.getItem('userId'),
        // },
      }),
      credentials: 'include',
      method: 'POST',
    });

    this.props.dispatch({
      type: 'REMOVE_TASK',
      payload: {
        category,
        itemID,
      },
    });
  };

  onTaskDeleteClick = id => (event) => {
    event.preventDefault();
    // this.onTaskDelete(id);
    this.changeModal(`delete-${id}`);
  };

  onTaskDeleteConfirmClick = task => () => {
    this.changeModal(null);
    this.onTaskDelete(task);
  };

  onTaskEditClick = id => (event) => {
    event.preventDefault();
    this.changeModal(`edit-${id}`);
  };

  onTaskUpdate = async (values) => {
    const response = await fetch(`${path}/app/task/update`, {
      body: JSON.stringify({
        task: {
          ...values,
          deadline: values.deadline ? moment(values.deadline).format('MMM DD, YYYY') : null,
          notification: values.notification ? moment(values.notification).format('MMM DD, YYYY') : null,
          completed: values.completed ? 1 : 0,
          pinned: values.pinned ? 1 : 0,
          taskID: values.itemID,
        },
      }),
      credentials: 'include',
      method: 'POST',
    });

    const { data: task } = await response.json();

    this.props.dispatch({
      type: 'UPDATE_TASK',
      payload: task,
    });

    this.onHideModal();
  };

  render() {
    const { tasks } = this.props;
    const { activeModal } = this.state;
    let modalTask;

    if (activeModal && activeModal.includes('-')) {
      modalTask = Object.values(tasks)
        .reduce((prev, curr) => [...prev, ...curr], [])
        .find(task => task.itemID === Number(activeModal.split('-')[1]));
    }

    return (
      <div id="my-tasks">
        <Modal onHide={this.onHideModal} show={activeModal === 'create-task'}>
          <ModalHeader closeButton={true} onHide={this.onHideModal}>
            Create Task
          </ModalHeader>
          <ModalBody>
            <TaskForm onSubmit={this.onTaskCreate} />
          </ModalBody>
        </Modal>
        <Modal onHide={this.onHideModal} show={activeModal && activeModal.startsWith('edit')}>
          <ModalHeader closeButton={true} onHide={this.onHideModal}>
            Edit Task
          </ModalHeader>
          <ModalBody>
            <TaskForm
              isInitialValid={true}
              onSubmit={this.onTaskUpdate}
              task={activeModal && activeModal.startsWith('edit') && modalTask}
            />
          </ModalBody>
        </Modal>
        <Modal
          bsSize="small"
          onHide={this.onHideModal}
          show={activeModal && activeModal.startsWith('delete')}
        >
          <ModalHeader closeButton={true} onHide={this.onHideModal}>
            Are you sure you want to delete{' '}
            {activeModal && activeModal.startsWith('delete') && modalTask.name}?
          </ModalHeader>
          <ModalFooter>
            <Button bsSize="sm" onClick={this.onHideModal}>
              Close
            </Button>
            <Button
              bsSize="sm"
              bsStyle="danger"
              onClick={
                activeModal && activeModal.startsWith('delete')
                  ? this.onTaskDeleteConfirmClick(modalTask)
                  : undefined
              }
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>
        <Row>
          <Col
            style={{ alignItems: 'flex-end', display: 'flex', justifyContent: 'space-between' }}
            xs={12}
          >
            <h2 style={{ width: 'fit-content' }}>Tasks</h2>
            <Button
              bsSize="sm"
              bsStyle="primary"
              onClick={this.onTaskCreateClick}
              style={{ height: 'fit-content', marginBottom: '10.5px' }}
            >
              Create Task
            </Button>
          </Col>
        </Row>
        
        {Object.keys(tasks).map((value, index) => (
          <Panel bsStyle="success" key={index}>
            <Panel.Heading>
              <Panel.Title componentClass="h3">{value}</Panel.Title>
            </Panel.Heading>
            <Panel.Body>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <TaskList
                  tasks={tasks[value].map(task => ({
                    ...task,
                    id: task.itemID,
                    onTaskComplete: this.onTaskComplete(task),
                    onTaskDeleteClick: this.onTaskDeleteClick(task.itemID),
                    onTaskEditClick: this.onTaskEditClick(task.itemID),
                  }))}
                />
              </DragDropContext>
            </Panel.Body>
          </Panel>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const obj = {};

  Object.entries(state.tasks).forEach(([key, value]) => {
    if (value) {
      obj[key] = value;
    }
  });

  return {
    tasks: obj,
  };
};

export default connect(mapStateToProps)(Tasks);
