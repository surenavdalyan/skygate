import React from 'react';
import moment from 'moment';
import Fields from '../../constants/Fields';

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
      <div className="hover-header">{title} <span className="pull-right">({stand})</span> </div>

      <div className="hover-item">
        <i className="fa fa-plane" />
        {arrivalInfo}
      </div>
      <div className="hover-item">{arrivalType}</div>
      <div className="hover-item">{arrivalTimeScheduled}</div>
      <div className="hover-item">{arrivalTimeProjected}</div>

      <div className="pull-right right-align">
        <div className="hover-item">
          {departureInfo}
          <i className="fa fa-plane" />
        </div>
        <div className="hover-item">{departureType}</div>
        <div className="hover-item">{departureTimeScheduled}</div>
        <div className="hover-item">{departureTimeProjected}</div>
      </div>
    </React.Fragment>
  );
};
