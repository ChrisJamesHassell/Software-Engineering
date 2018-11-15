import { Form, Formik } from 'formik';
import moment from 'moment';
import React from 'react';
import { Button, FormControl, FormGroup } from 'react-bootstrap';
import Select from 'react-select';

const boolOptions = [{ label: 'Yes', value: true }, { label: 'No', value: false }];
const categoryOptions = [
  { label: 'Appliances', value: 'APPLIANCES' },
  { label: 'Auto', value: 'AUTO' },
  { label: 'Meals', value: 'MEALS' },
  { label: 'Medical', value: 'MEDICAL' },
  { label: 'Miscellaneous', value: 'MISCELLANEOUS' },
];
export const priorityOptions = [
  { label: 'High', value: 'HIGH' },
  { label: 'Medium', value: 'MED' },
  { label: 'Low', value: 'LOW' },
];

export default class TaskForm extends React.Component {
  onSelectChange = (field, setFieldValue) => option => setFieldValue(field, option);

  onSubmit = (values, { setSubmitting }) => {
    this.props.onSubmit({
      ...values,
      category: values.category.value,
      pinned: values.pinned.value ? 1 : 0,
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
              notification: moment(task.notification).format('YYYY-MM-DD'),
              pinned: boolOptions.find(op => op.value === task.pinned),
              priority: priorityOptions.find(op => op.value === task.priority),
            }
            : {
              category: categoryOptions[0].value,
              deadline: '',
              description: '',
              name: '',
              notification: '',
              pinned: null,
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
              <label>Name</label>
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
              <label>Description</label>
              <FormControl
                name="description"
                onChange={handleChange}
                placeholder="Description"
                value={values.description}
              />
            </FormGroup>
            <FormGroup>
              <label>Category</label>
              <Select
                onChange={this.onSelectChange('category', setFieldValue)}
                options={categoryOptions}
                required
                placeholder={categoryOptions[0].value}
                value={values.category}
              />
            </FormGroup>
            <FormGroup>
              <label>Deadline</label>
              <FormControl
                name="deadline"
                onChange={handleChange}
                type="date"
                value={values.deadline}
              />
            </FormGroup>
            <FormGroup>
              <label>Notification</label>
              <FormControl
                name="notification"
                onChange={handleChange}
                type="date"
                value={values.notification}
              />
            </FormGroup>
            <FormGroup>
              <label>Priority</label>
              <Select
                onChange={this.onSelectChange('priority', setFieldValue)}
                options={priorityOptions}
                placeholder={priorityOptions[2].label}
                value={values.priority}
              />
            </FormGroup>
            <FormGroup>
              <label>Pinned?</label>
              <Select
                onChange={this.onSelectChange('pinned', setFieldValue)}
                options={boolOptions}
                placeholder="Select Pinned..."
                value={values.pinned}
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
