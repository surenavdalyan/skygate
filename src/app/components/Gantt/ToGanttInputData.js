import moment from 'moment';
import Fields from '../../constants/Fields';
import { AssignmentColorMapping } from '../../constants/ColorPalette';
import PointGeometryType from '../../constants/PointGeometryType';
import ValueType from '../../constants/ValueType';
import HoverContent from './HoverContent';

const TypetoPointGeometry = (ArrDepType) => {
  switch (ArrDepType) {
    case ValueType.DOMESTIC: return PointGeometryType.DIMOND;
    case ValueType.INTERNATIONAL: return PointGeometryType.BAR;
    case ValueType.PARKING: return PointGeometryType.THREE_DOTS;
    case ValueType.UNKNOWN: return null;
    default: break;
  }
  return null;
};

export default (data) => {
  const { TimeData, StandData, AssignmentData } = data;
  return {
    YData: {
      data: StandData.data,
      getter: {
        getLabel: y => y.name,
        getData: y => y,
      },
    },
    XData: {
      StartTime: new Date(TimeData.StartTime),
      EndTime: new Date(TimeData.EndTime),
    },
    TSData: {
      data: Object.values(AssignmentData.data),
      getter: (r) => {
        const scheduledArrivalTime = new Date(r[Fields.SCHEDULED_ARRIVAL_DATETIME]);
        const scheduledDepartureTime = new Date(r[Fields.SCHEDULED_DEPARTURE_DATETIME]);
        const arrivalTimeHMM = moment(scheduledArrivalTime).format('h:mm');
        const departureTimeHMM = moment(scheduledDepartureTime).format('h:mm');

        // Define what geometry to be drown at left and right sides
        const LeftPointGeometry = TypetoPointGeometry(r[Fields.ARRIVAL_TYPE]);
        const RightPointGeometry = TypetoPointGeometry(r[Fields.DEPARTURE_TYPE]);

        return {
          Y: r[Fields.STAND_ID],
          StartDate: scheduledArrivalTime,
          EndDate: scheduledDepartureTime,
          data: r,
          Color: AssignmentColorMapping[r[Fields.COLOR]] || [0, 0, 0],
          Properties: {
            CenterLabel: r[Fields.EQUIPMENT_TYPE],
            LeftTag: r[Fields.ARRIVAL_INFO],
            RightTag: r[Fields.DEPARTURE_INFO],
            LeftBottomTag: arrivalTimeHMM,
            RightBottomTag: departureTimeHMM,
            LeftPointGeometry,
            RightPointGeometry,
          },
        };
      },
    },
    HoverContent,
  };
};
