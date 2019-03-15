import moment from 'moment';
import Fields from '../../constants/Fields';
import { AssignmentColorMapping } from '../../constants/ColorPalette';
import PointGeometryType from '../../constants/PointGeometryType';
import ValueType from '../../constants/ValueType';
import HoverContent from './HoverContent';
import { applyFilters } from '../Utils';

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

const TimeError = 0;

const showProjectedDetails = (
  scheduledArrivalTime,
  scheduledDepartureTime,
  projectedArrivalTime,
  projectedDepartureTime,
) => (
  Math.abs(scheduledArrivalTime - projectedArrivalTime) +
    Math.abs(scheduledDepartureTime - projectedDepartureTime) > TimeError
);

export default (data, filters) => {
  const { TimeData, StandData, AssignmentData } = data;
  const filterAppliedData = applyFilters(AssignmentData.data, filters);
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
      data: Object.values(filterAppliedData),
      getter: (r) => {
        const scheduledArrivalTime = new Date(r[Fields.SCHEDULED_ARRIVAL_DATETIME]);
        const scheduledDepartureTime = new Date(r[Fields.SCHEDULED_DEPARTURE_DATETIME]);
        const arrivalTimeHMM = moment(scheduledArrivalTime).format('H:mm');
        const departureTimeHMM = moment(scheduledDepartureTime).format('H:mm');

        const projectedArrivalTime = new Date(r[Fields.PROJECTED_ACTUAL_ARRIVAL_TIME]);
        const projectedDepartureTime = new Date(r[Fields.PROJECTED_ACTUAL_DEPARTURE_TIME]);
        const shouldShowProjectedDetails = showProjectedDetails(
          scheduledArrivalTime,
          scheduledDepartureTime,
          projectedArrivalTime,
          projectedDepartureTime,
        );

        // Define what geometry to be drown at left and right sides
        const LeftPointGeometry = TypetoPointGeometry(r[Fields.ARRIVAL_TYPE]);
        const RightPointGeometry = TypetoPointGeometry(r[Fields.DEPARTURE_TYPE]);

        let Alpha = null;
        if (Fields.FILTERED_STATE in r && !r[Fields.FILTERED_STATE]) {
          Alpha = 0.2;
        }
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
            Alpha,
            ProjectedDetails: shouldShowProjectedDetails ? {
              ProjectedStartDate: projectedArrivalTime,
              ProjectedEndDate: projectedDepartureTime,
            } : undefined,
          },
        };
      },
    },
    HoverContent,
  };
};
