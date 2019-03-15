import React from 'react';
import moment from 'moment';

import './index.scss';

const formattedDate = date => moment(date).format('MMM DD[,] YYYY');
const formattedDay = date => moment(date).format('DD');

class Header extends React.Component {
  constructor(props) {
    super(props);
    const refreshTime = 'Today 11:10 AM';
    this.state = {
      StartTime: '2019-04-01T00:00:00',
      EndTime: '2019-04-08T00:00:00',
      refreshTime,
    };
  }

  render() {
    const startDate = formattedDate(this.state.StartTime);
    const endDate = formattedDate(this.state.EndTime);
    const startDay = formattedDay(this.state.StartTime);
    const endDay = formattedDay(this.state.EndTime);
    return (
      <div className="header-area">
        <div className="header-area-left">
          <span className="span-calendar">{startDay}</span>
          <span>{startDate}</span>
          - - - - - -
          <span className="span-calendar">{endDay}</span>
          <span>{endDate}</span>
        </div>
        <div className="header-area-center">
          <img
            src="../../../assets/images/SkyGATE Logo-01.png"
            alt="skygatelogo"
          />
        </div>
        <div className="header-area-right">
          <span>
              Refreshed:{this.state.refreshTime}
            <i className="icon-autorenew" />
          </span>
          <input type="text" placeholder="search" />
          <span className="span-notify" />
        </div>
      </div>
    );
  }
}

export default Header;
