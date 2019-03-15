// import * as types from '../actions/actionTypes';
import { SampleStandAssignment001 } from './SampleInput';
import StandsSequence001 from './StandsSequence';
import AirlineCodes from './AirlineCodes';

const StandData = StandsSequence001.map(stnd => ({
  name: stnd['Stands Sequence'],
}));

const AirlineCodeData = AirlineCodes.map(air => air.Airlines).filter(a => a !== "");

const initState = {
  TimeData: {
    StartTime: '2019-04-01T00:00:00',
    EndTime: '2019-04-08T00:00:00',
  },
  StandData: {
    data: StandData,
  },
  AssignmentData: {
    data: SampleStandAssignment001,
  },
  AirlineCodeData,
};

export default function sampleDataReducer() {
  return initState;
}
