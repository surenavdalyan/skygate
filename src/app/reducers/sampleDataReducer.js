// import * as types from '../actions/actionTypes';
import { SampleStandAssignment001 } from './SampleInput';
import StandsSequence001 from './StandsSequence';

const StandData = StandsSequence001.map(stnd => ({
  name: stnd['Stands Sequence']
}));

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
