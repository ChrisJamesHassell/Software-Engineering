import React, { Fragment } from 'react';
import {
  Button,
  Glyphicon,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Panel,
} from 'react-bootstrap';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';

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
        style={{ alignItems: 'center', display: 'flex' }}
      >
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
    )}
  </Draggable>
);

export class TaskList extends React.Component {
  render() {
    const { tasks } = this.props;

    return (
      <Fragment>
        {[2, 1, 0].map((value, index) => {
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

class Tasks extends React.Component {
  state = {
    activeModal: null,
  };

  changeModal = value => this.setState({ activeModal: value });

  onDragEnd = (result) => {
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

    const task = tasks.find(tsk => tsk.taskID === draggableId);

    if (!task) return;

    this.props.dispatch({
      type: 'UPDATE_TASK',
      payload: {
        ...task,
        priority: newPriority.value,
      },
    });
  };

  onHideModal = () => this.changeModal(null);

  onTaskClick = task => () => {
    console.log({ task });
  };

  onTaskComplete = task => () => this.props.dispatch({
    type: 'UPDATE_TASK',
    payload: {
      ...task,
      completed: !task.completed,
    },
  });

  onTaskCreate = (values) => {
    const newID = Math.max(...this.props.tasks.map(task => task.taskID)) + 1;

    this.props.dispatch({
      type: 'ADD_TASK',
      payload: {
        ...values,
        taskID: newID,
      },
    });
    this.onHideModal();
  };

  onTaskCreateClick = () => this.changeModal('create-task');

  onTaskDelete = taskID => this.props.dispatch({
    type: 'REMOVE_TASK',
    payload: {
      taskID,
    },
  });

  onTaskDeleteClick = id => (event) => {
    event.preventDefault();
    // this.onTaskDelete(id);
    this.changeModal(`delete-${id}`);
  };

  onTaskDeleteConfirmClick = id => () => {
    this.changeModal(null);
    this.onTaskDelete(id);
  };

  onTaskEditClick = id => (event) => {
    event.preventDefault();
    this.changeModal(`edit-${id}`);
  };

  onTaskUpdate = (values) => {
    this.props.dispatch({
      type: 'UPDATE_TASK',
      payload: values,
    });
    this.onHideModal();
  };

  render() {
    const { tasks } = this.props;
    const { activeModal } = this.state;

    console.log(tasks);

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
              onSubmit={this.onTaskUpdate}
              task={
                activeModal
                && activeModal.startsWith('edit')
                && this.props.tasks.find(task => task.taskID === Number(activeModal.split('-')[1]))
              }
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
            {activeModal
              && activeModal.startsWith('delete')
              && tasks.find(task => task.taskID === Number(activeModal.split('-')[1])).name}
            ?
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
                  ? this.onTaskDeleteConfirmClick(Number(activeModal.split('-')[1]))
                  : undefined
              }
            >
              Delete
            </Button>
          </ModalFooter>
        </Modal>
        {['Appliances', 'Auto', 'Meals', 'Medical', 'Miscellaneous'].map((value, index) => (
          <Panel bsStyle="success" key={index}>
            <Panel.Heading style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Panel.Title componentClass="h3">{value}</Panel.Title>
              <Button bsSize="sm" bsStyle="primary" onClick={this.onTaskCreateClick}>
                Create Task
              </Button>
            </Panel.Heading>
            <Panel.Body>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <TaskList
                  tasks={tasks[value].map(task => ({
                    ...task,
                    id: task.taskID,
                    onTaskClick: this.onTaskClick(task),
                    onTaskComplete: this.onTaskComplete(task),
                    onTaskDeleteClick: this.onTaskDeleteClick(task.taskID),
                    onTaskEditClick: this.onTaskEditClick(task.taskID),
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

const mapStateToProps = state => ({
  tasks: {
    Appliances: state.tasks.Appliances,
    Auto: state.tasks.Auto,
    Meals: state.tasks.Meals,
    Medical: state.tasks.Medical,
    Miscellaneous: state.tasks.Miscellaneous,
  },
});

export default connect(mapStateToProps)(Tasks);
