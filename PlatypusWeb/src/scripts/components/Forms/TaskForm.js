import { Form, Formik } from 'formik';
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
const priorityOptions = [
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
    return (
      <Formik
        initialValues={{
          category: null,
          deadline: '',
          description: '',
          name: '',
        }}
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
                value={values.priority}
              />
            </FormGroup>
            <Button bsSize="sm" bsStyle="primary" disabled={isSubmitting} type="submit">
              Create
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
}
