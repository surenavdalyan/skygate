// import * as types from '../actions/actionTypes';
import { SampleStandAssignment001 } from './SampleInput';
import Fields from '../constants/Fields';


const { STAND_ID } = Fields;

// Create Y Data - Processing
const StandData = [];
const StandDataHash = {};
SampleStandAssignment001.forEach((obj) => {
  if (obj[STAND_ID] && obj[STAND_ID] !== '') {
    const key = obj[STAND_ID];
    if (!StandDataHash[key]) {
      StandData.push({
        name: obj[STAND_ID],
      });
      StandDataHash[key] = true;
    }
  }
});


const initState = {
  TimeData: {
    StartTime: '2019-03-31T20:40:00',
    EndTime: '2019-04-10T19:45:00',
  },
  StandData: {
    data: StandData,
  },
  AssignmentData: {
    data: SampleStandAssignment001,
  },
};

export default function sampleDataReducer() {
  return initState;
}
