import React from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';

const Task = ({ index, task: { name, taskID } }) => (
    <Draggable draggableId={`task-${taskID}`} index={index}>
        {provided => (
            <div
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                className="task"
                ref={provided.innerRef}
            >
                {name}
            </div>
        )}
    </Draggable>
);

const TaskList = ({ id, tasks }) => (
    <Droppable droppableId={id}>
        {provided => (
            <div
                {...provided.droppableProps}
                className="task-list"
                ref={provided.innerRef}
            >
                {tasks.map((task, index) => (
                    <Task key={index} index={index} task={task} />
                ))}
                {provided.placeholder}
            </div>
        )}
    </Droppable>
);

class Category extends React.Component {
    state = {
        tasks: [],
    };

    static getDerivedStateFromProps(props, state) {
        if (props && state && props.tasks.length !== state.tasks.length) {
            console.log(props.match, props.tasks);
            return {
                tasks: props.tasks.filter(
                    task =>
                        task.category.toLowerCase() ===
                        props.match.params.category
                ),
            };
        }

        return null;
    }

    onDragEnd = result => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const tasks = [...this.state.tasks];
        const [removed] = tasks.splice(result.source.index, 1);

        tasks.splice(result.destination.index, 0, removed);
        this.setState({
            tasks,
        });
    };

    render() {
        const {
            match: { params },
        } = this.props;
        const { tasks } = this.state;

        return (
            <>
                <h1>
                    {params.category[0].toUpperCase() +
                        params.category.slice(1)}
                </h1>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <TaskList id="tasks" tasks={tasks} />
                </DragDropContext>
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        tasks: state.tasks,
    };
};

const CategoryConnected = connect(mapStateToProps)(Category);

export default CategoryConnected;
