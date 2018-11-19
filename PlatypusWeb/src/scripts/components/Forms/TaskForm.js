import { Form, Formik } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
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
  { label: 'Medium', value: 'MID' },
  { label: 'Low', value: 'LOW' },
];

export default class TaskForm extends React.Component {
  static propTypes = {
    isInitialValid: PropTypes.bool,
  };

  handleValidation = (values) => {
    const errors = {};

    ['category', 'name', 'pinned', 'priority'].forEach((key) => {
      if (!values[key]) {
        errors[key] = 'Required field';
      }
    });

    return errors;
  };

  onSelectChange = (field, setFieldValue, defaultValue = null) => option => setFieldValue(field, Array.isArray(option) ? defaultValue : option);

  onSubmit = (values, { setSubmitting }) => {
    
    const vals = {
      ...values,
      category: values.category.value || 'APPLIANCES',
      // deadline: values.deadline.length < 1 ? 'null': values.deadline,
      // notification: values.notification.length < 1 ? 'null' : values.notification,
      pinned: values.pinned.value ? 1 : 0,
      priority: values.priority.value,
    }
    console.log("TASKVALUES: ", vals);
    this.props.onSubmit(vals);
    setSubmitting(false);
  };

  render() {
    const { isInitialValid, task } = this.props;

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
              category: categoryOptions[0].label,
              deadline: '',
              description: '',
              name: '',
              notification: '',
              pinned: boolOptions.find(op => op.value === true),
              priority: priorityOptions.find(op => op.value === 'LOW'),
            }
        }
        isInitialValid={isInitialValid || false}
        onSubmit={this.onSubmit}
        validate={this.handleValidation}
      >
        {({
          handleChange, isSubmitting, isValid, setFieldValue, values,
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
                placeholder={categoryOptions[0].label}
                value={values.category || categoryOptions[0].value}
              />
            </FormGroup>
            <FormGroup>
              <label>Deadline</label>
              <FormControl
                name="deadline"
                onChange={handleChange}
                type="date"
                value={values.deadline || ''}
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
                onChange={this.onSelectChange(
                  'priority',
                  setFieldValue,
                  priorityOptions.find(op => op.value === 'LOW'),
                )}
                options={priorityOptions}
                placeholder={priorityOptions[2].label}
                value={values.priority || priorityOptions[2].value}
              />
            </FormGroup>
            <FormGroup>
              <label>Pinned?</label>
              <Select
                onChange={this.onSelectChange(
                  'pinned',
                  setFieldValue,
                  boolOptions.find(op => op.value === false),
                )}
                options={boolOptions}
                placeholder="Select Pinned..."
                value={values.pinned || true}
              />
            </FormGroup>
            <Button bsSize="sm" bsStyle="primary" disabled={isSubmitting || !isValid} type="submit">
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
}
