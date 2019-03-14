import numeral from "numeral";
import moment from "moment";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isEmpty from "lodash/isEmpty";
import isFunction from "lodash/isFunction";
import _assign from "lodash/assign";
import noop from "lodash/noop";
import React from "react";
import { cloneDeep as _cloneDeep } from "lodash/lang";

const formatNumber = number => {
  if (number === null) {
    return "NAN";
  }

  return isNumber(number) ? numeral(number).format("0,0") : "";
};

const formatString = str => {
  if (isString(str)) {
    return str.trim();
  }
  return "";
};

const formatDate = (date, format) => {
  if (!date) {
    return "";
  }
  return moment(date).isValid() ? moment(date).format(format) : "";
};
export function convertDurationIntoTime(input) {
  let minutes = Math.round(Math.abs(input) % 60);
  let hours = Math.round(Math.abs(input) - minutes) / 60;

  hours = String(hours).length === 1 ? `0${hours}` : formatNumber(hours);
  minutes =
    String(minutes).length === 1 ? `0${minutes}` : formatNumber(minutes);

  return `${(input < 0 ? "-" : "") + hours}:${minutes}`;
}
export function convertDateIntoMinutes(date) {
  const dateVal = moment(date);
  return dateVal.hours() * 60 + dateVal.minutes();
}

export const getRowClass = ({ api, node }) => {
  let className = "";
  if (
    node.data &&
    api.gridOptionsWrapper.gridConfig &&
    api.gridOptionsWrapper.gridConfig.editedRowsData
  ) {
    const { keyColumn } = api.gridOptionsWrapper.gridConfig;
    const key = node.data[keyColumn];
    if (isRowChanged(api, key)) {
      className = "dirty-row";
    }
  }
  return className;
};

export const formatNum = formatNumber;
export const dateFormatter = formatDate;
export function RenderETA(params) {
  let newValue;
  if (params.data.eta != null) {
    let timeSlot = params.data.deliveryWindow;
    if (timeSlot) {
      timeSlot = timeSlot.split("-");
      const eta = getMinutes(params.data.eta);
      // if (timeSlot.length > 1) {
      //   if (
      //     eta + 20 < getMinutes(timeSlot[0]) ||
      //     eta > getMinutes(timeSlot[1])
      //   ) {
      //     //add class to highlight
      //   }
      // }
      newValue = params.data.eta.substring(0, params.data.eta.lastIndexOf(":"));
    } else {
      newValue = params.data.eta;
    }
    return newValue;
  }
}
export function formatTtlMiles(params) {
  const totalMiles = params.data.totalMiles;
  if (totalMiles !== null) {
    return parseFloat(totalMiles.toFixed(2));
  }
  return null;
}
export function liftGateRenderer(params) {
  const liftGate = params.data.liftGate;
  if (liftGate === "L") {
    return liftGate;
  }
  return "";
}
export function renderTotalTime(params) {
  const totalTime = params.data.totalTime;
  if (totalTime !== null) {
    let hours = Math.floor(totalTime / 60);
    let minutes = Math.floor(totalTime) % 60;
    hours = hours < 10 ? `0${hours}` : hours;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutes}`;
  }
  return null;
}
export function renderStartTime(params) {
  const startTime = params.data.startTime;
  if (startTime !== null) {
    return startTime.substring(0, startTime.lastIndexOf(":"));
  }
  return null;
}
export function ttlCost(params) {
  let cost = params.data.totalCost;
  if (cost !== null) {
    cost = cost.toFixed(2);
    return `$${cost}`;
  }
  return null;
}
export function tooltipField(params) {
  if (params.value !== null) {
    return `<span title="${params.value}">${params.value}</span>`;
  }
  return "";
}
function getMinutes(str) {
  if (str) {
    const time = str.split(":");
    return time[0] * 60 + time[1] * 1;
  }
  return "";
}

export const getRowStyle = params => {
  if (params.data.statusType === true) {
    return {
      background: "#092A4D",
      color: "#fff"
    };
  }
  return {
    background: "#144c87",
    color: "#fff"
  };
};

export const rowClass = params => "grid_row";
export const getRowHeight = params => 30;
export const getHeaderHeight = params => 30;
export const getRowNodeId = data => data;
export const timeFormatter = params => {
  return moment(params.value).format("D/mm/YYYY hh:mm:ss a");
}

export const getHeaderName = date => {

  if(!moment(date).isValid()) return date;
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];
  return `${months[moment(date).month()]} ${moment(date).year()}`;
}

export const percentageFormatter = ({value}) => {
  if(!isNaN(value)) {
    return `${value}%`
  }  return value;
}

