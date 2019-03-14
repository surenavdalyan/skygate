import React from 'react';
import Fields from '../../constants/Fields';
import moment from 'moment';

const timeFormatter = date => moment(date).format('MM/DD HH:mm');

export default ({ obj }) => {
  const title = obj[Fields.EQUIPMENT_TYPE];
  const stand = obj[Fields.STAND_ID];

  const arrivalInfo = obj[Fields.ARRIVAL_INFO];
  const departureInfo = obj[Fields.DEPARTURE_INFO];

  const arrivalType = obj[Fields.ARRIVAL_TYPE];
  const departureType = obj[Fields.DEPARTURE_TYPE];

  const arrivalTimeScheduled = timeFormatter(obj[Fields.SCHEDULED_ARRIVAL_DATETIME]);
  const departureTimeScheduled = timeFormatter(obj[Fields.SCHEDULED_DEPARTURE_DATETIME]);

  const arrivalTimeProjected = timeFormatter(obj[Fields.PROJECTED_ACTUAL_ARRIVAL_TIME]);
  const departureTimeProjected = timeFormatter(obj[Fields.PROJECTED_ACTUAL_DEPARTURE_TIME]);

  return (
    <React.Fragment>
      <div className="hover-header">{title} ({stand}) </div>

      <div className="hover-item">{arrivalInfo}</div>
      <div className="hover-item">{arrivalType}</div>
      <div className="hover-item">{arrivalTimeScheduled}</div>
      <div className="hover-item">{arrivalTimeProjected}</div>

      <div className="pull-right right-align">
        <div className="hover-item">{departureInfo}</div>
        <div className="hover-item">{departureType}</div>
        <div className="hover-item">{departureTimeScheduled}</div>
        <div className="hover-item">{departureTimeProjected}</div>
      </div>
    </React.Fragment>
  );
};
