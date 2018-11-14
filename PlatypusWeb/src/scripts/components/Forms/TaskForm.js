import { Form, Formik } from 'formik';
import moment from 'moment';
import React from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import Select from 'react-select';

// THESE ARE THE CATEGORY OPTIONS ['Appliances', 'Auto', 'Meals', 'Medical', 'Miscellaneous'];
const categoryOptions = [
  { label: 'Appliances', value: 'Appliances' },
  { label: 'Auto', value: 'Auto' },
  { label: 'Meals', value: 'Meals' },
  { label: 'Medical', value: 'Medical' },
  { label: 'Miscellaneous', value: 'Miscellaneous' },
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
      deadline: values.deadline && new Date(values.deadline).toISOString(),
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
              category: categoryOptions[0].value,
              deadline: '',
              description: '',
              name: '',
              priority: priorityOptions[2].value,
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
                required
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
                required
                placeholder={categoryOptions[0].value}
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
                placeholder={priorityOptions[2].label}
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
