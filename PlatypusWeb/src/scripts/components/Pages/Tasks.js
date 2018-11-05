import React from 'react';
import {
  Button, Glyphicon, Modal, ModalHeader, ModalBody, Panel, Table,
} from 'react-bootstrap';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';

import TaskForm from '../Forms/TaskForm';

const Task = ({
  index,
  onTaskClick,
  onTaskDeleteClick,
  onTaskEditClick,
  task: { description, id, name },
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
    )}
  </Draggable>
);

export class TaskList extends React.Component {
  render() {
    const { tasks } = this.props;

    return (
      <Droppable droppableId="tasks">
        {provided => (
          <div {...provided.droppableProps} className="task-list" ref={provided.innerRef}>
            {tasks.map(({
              onTaskClick, onTaskDeleteClick, onTaskEditClick, ...task
            }, index) => (
              <Task
                index={index}
                key={index}
                onTaskClick={onTaskClick}
                onTaskDeleteClick={onTaskDeleteClick}
                onTaskEditClick={onTaskEditClick}
                task={task}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
  }
}

class Tasks extends React.Component {
  state = {
    activeModal: null,
  };

  changeModal = value => this.setState({ activeModal: value });

  onHideModal = () => this.changeModal(null);

  onTaskClick = task => () => {
    console.log({ task });
  };

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

  // TODO: Add delete confirmation
  onTaskDelete = taskID => this.props.dispatch({
    type: 'REMOVE_TASK',
    payload: {
      taskID,
    },
  });

  onTaskDeleteClick = id => (event) => {
    event.preventDefault();
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

    return (
      <div id="my-tasks">
        <Panel bsStyle="success">
          <Panel.Heading style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Panel.Title componentClass="h3">My Tasks</Panel.Title>
            <Button bsSize="sm" bsStyle="primary" onClick={this.onTaskCreateClick}>
              Create Task
            </Button>
            <Modal onHide={this.onHideModal} show={activeModal === 'create-task'}>
              <ModalHeader closeButton={true} onHide={this.onHideModal}>
                Create Task
              </ModalHeader>
              <ModalBody>
                <TaskForm onSubmit={this.onTaskCreate} />
              </ModalBody>
            </Modal>
          </Panel.Heading>
          <Panel.Body>
            <DragDropContext>
              <TaskList
                tasks={tasks.map(task => ({
                  ...task,
                  id: task.taskID,
                  onTaskClick: this.onTaskClick(task),
                  onTaskDeleteClick: this.onTaskDeleteClick(task.taskID),
                  onTaskEditClick: this.onTaskEditClick(task.taskID),
                }))}
              />
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
                      && this.props.tasks.find(
                        task => task.taskID === Number(activeModal.split('-')[1]),
                      )
                    }
                  />
                </ModalBody>
              </Modal>
            </DragDropContext>
          </Panel.Body>
        </Panel>

        <Panel bsStyle="info">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Group Tasks</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            Whatever the fuck Johnathan wants to do.
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
              </tbody>
            </Table>
          </Panel.Body>
        </Panel>

        <Panel bsStyle="info">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Group Tasks</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            Whatever the fuck Johnathan wants to do.
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
              </tbody>
            </Table>
          </Panel.Body>
        </Panel>

        <Panel bsStyle="info">
          <Panel.Heading>
            <Panel.Title componentClass="h3">Group Tasks</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            Whatever the fuck Johnathan wants to do.
            <Table responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                  <th>Table heading</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                </tr>
              </tbody>
            </Table>
          </Panel.Body>
        </Panel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  tasks: state.tasks,
});

export default connect(mapStateToProps)(Tasks);
