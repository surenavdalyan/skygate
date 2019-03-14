import React from 'react';
import Fields from '../../constants/Fields';

export default ({ obj }) => {
  const title = obj[Fields.EQUIPMENT_TYPE];
  const stand = obj[Fields.STAND_ID];

  const arrivalInfo = obj[Fields.ARRIVAL_INFO];
  const departureInfo = obj[Fields.DEPARTURE_INFO];

  const arrivalType = obj[Fields.ARRIVAL_TYPE];
  const departureType = obj[Fields.DEPARTURE_TYPE];

  const arrivalTime = obj[Fields.SCHEDULED_ARRIVAL_DATETIME];
  const departureTime = obj[Fields.SCHEDULED_DEPARTURE_DATETIME];

  return (
    <React.Fragment>
      <div className="hover-header">{title} ({stand}) </div>

      <div className="hover-item">{arrivalInfo}</div>
      <div className="hover-item">{arrivalType}</div>
      <div className="hover-item">{arrivalTime}</div>

      <div className="pull-right right-align">
        <div className="hover-item">{departureInfo}</div>
        <div className="hover-item">{departureType}</div>
        <div className="hover-item">{departureTime}</div>
      </div>
    </React.Fragment>
  );
};
