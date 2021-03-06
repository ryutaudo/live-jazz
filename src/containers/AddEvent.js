import { connect } from 'react-redux';
import AddEvent from '../components/AddEvent';

import {
  addNewEvent,
  setEventNameField,
  setArtistField,
  setVenueField,
  setAddressField,
  setPriceField,
  setDateField,
  setStartTimeField,
  setEndTimeField,
} from '../actions';

const mapStateToProps = state => ({
  addEventResponse: state.addEventResponse,
  addEventFields: state.addEventFields,
});

const mapDispatchToProps = dispatch => ({
  onEventNameInput: (event) => {
    dispatch(setEventNameField(event));
  },
  onArtistInput: (event) => {
    dispatch(setArtistField(event));
  },
  onVenueInput: (event) => {
    dispatch(setVenueField(event));
  },
  onAddressInput: (event) => {
    dispatch(setAddressField(event));
  },
  onPriceInput: (event, value, oldval) => {
    if (value !== '' && ((isNaN(parseInt(value, 10)) || isNaN(Number(value))) ||
      parseInt(value, 10) !== Number(value) ||
      parseInt(value, 10) < 0 ||
      parseInt(value, 10) === parseInt(oldval, 10))) {
      event.preventDefault();
    } else {
      dispatch(setPriceField(value));
    }
  },
  onDateInput: (event, date) => {
    dispatch(setDateField(date));
  },
  onStartTimeInput: (event, time) => {
    dispatch(setStartTimeField(time));
  },
  onEndTimeInput: (event, time) => {
    dispatch(setEndTimeField(time));
  },
  onFormSubmit: (event, addEventFields, history) => {
    event.preventDefault();
    addEventFields.startTime.setDate(addEventFields.date.getDate());
    addEventFields.startTime.setMonth(addEventFields.date.getMonth());
    addEventFields.startTime.setYear(addEventFields.date.getFullYear());
    addEventFields.endTime.setDate(addEventFields.date.getDate());
    addEventFields.endTime.setMonth(addEventFields.date.getMonth());
    addEventFields.endTime.setYear(addEventFields.date.getFullYear());
    dispatch(addNewEvent(addEventFields, history));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddEvent);
