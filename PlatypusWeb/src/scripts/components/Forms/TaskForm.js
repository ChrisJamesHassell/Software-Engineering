import { Form, Formik } from 'formik';
import moment from 'moment';
import React from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import Select from 'react-select';

const categoryOptions = [
  { label: 'Auto', value: 'Auto' },
  { label: 'Home', value: 'Home' },
  { label: 'Medical', value: 'Medical' },
  { label: 'Miscellaneous', value: 'Miscellaneous' },
  { label: 'ToDo', value: 'ToDo' },
];
export const priorityOptions = [
  { label: 'High', value: 2 },
  { label: 'Medium', value: 1 },
  { label: 'Low', value: 0 },
];

export default class TaskForm extends React.Component {
  onSelectChange = (field, setFieldValue) => option => setFieldValue(field, option);

  onSubmit = (values, { setSubmitting }) => {
    this.props.onSubmit({
      ...values,
      category: values.category.value,
      deadline: new Date(values.deadline).toISOString(),
      priority: values.priority.value,
    });
    setSubmitting(false);
  };

  render() {
    const { task } = this.props;

    return (
      <Formik
        initialValues={
          task
            ? {
              ...task,
              category: categoryOptions.find(op => op.value === task.category),
              deadline: moment(task.deadline).format('YYYY-MM-DD'),
              priority: priorityOptions.find(op => op.value === task.priority),
            }
            : {
              category: null,
              deadline: '',
              description: '',
              name: '',
              priority: null,
            }
        }
        onSubmit={this.onSubmit}
      >
        {({
          handleChange, isSubmitting, setFieldValue, values,
        }) => (
          <Form>
            <FormGroup>
              <FormControl
                autoFocus
                name="name"
                onChange={handleChange}
                placeholder="Name"
                value={values.name}
              />
            </FormGroup>
            <FormGroup>
              <FormControl
                name="description"
                onChange={handleChange}
                placeholder="Description"
                value={values.description}
              />
            </FormGroup>
            <FormGroup>
              <Select
                onChange={this.onSelectChange('category', setFieldValue)}
                options={categoryOptions}
                placeholder="Select Category..."
                value={values.category}
              />
            </FormGroup>
            <FormGroup>
              <FormControl
                name="deadline"
                onChange={handleChange}
                placeholder="Deadline"
                type="date"
                value={values.deadline}
              />
            </FormGroup>
            <FormGroup>
              <Select
                onChange={this.onSelectChange('priority', setFieldValue)}
                options={priorityOptions}
                placeholder="Select Priority..."
                value={values.priority}
              />
            </FormGroup>
            <Button bsSize="sm" bsStyle="primary" disabled={isSubmitting} type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
}
