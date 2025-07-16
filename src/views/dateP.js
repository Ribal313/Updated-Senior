// src/components/DatePicker/DatePicker.js
import React from "react";
import PropTypes from "prop-types";

const DatePicker = ({ selectedDate, onChange, maxDate }) => {
  // Format Date to YYYY-MM-DD string for input[type="date"]
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
   
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
     console.log(day);
    return `${year}-${month}-${day}`;
  };

  // Parse YYYY-MM-DD string back to Date object
 const parseDate = (dateString) => {
  if (!dateString) return new Date();
  const [year, month, day] = dateString.split("-");
  const parsedDate = new Date(year, month -1, day);
  //console.log(parsedDate);
  return parsedDate;
};


  return (
    <div className="date-picker-container">
      <i className="far fa-calendar-alt date-picker-icon"></i>
      <input
        type="date"
        value={formatDate(selectedDate)}
        onChange={(e) => onChange(parseDate(e.target.value))}
        max={maxDate ? formatDate(maxDate) : ""}
        className="date-picker-input"
      />
    </div>
  );
};

DatePicker.propTypes = {
  selectedDate: PropTypes.instanceOf(Date).isRequired,
  onChange: PropTypes.func.isRequired,
  maxDate: PropTypes.instanceOf(Date),
};

DatePicker.defaultProps = {
  maxDate: new Date(), // Defaults to today
};

export default DatePicker;
