import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { applyFilter } from '../../actions';
import LazyEvent from '../../graphics/lib/LazyEvent';

import './index.scss';
import DateRangePicker from '../../components/DateRange/DateRangePicker';

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
      showDateRange: false,
    };
    this.lazySearch = new LazyEvent();
  }
  showHideRange = () => {
    console.log(this);
    this.setState({ showDateRange: !this.state.showDateRange });
  };
  onDateRangeSelect = (StartTime, EndTime) => {
    this.setState({
      StartTime,
      EndTime,
    });
  };

  onSearchInput = (e) => {
    // console.log(e.target.value);
    const { value } = e.target;
    const includesInTheField = (r, val, field) => r[field] && r[field].includes(val);
    const SearchFilterConfig = v => ({
      filterLogic: r => includesInTheField(r, v, 'Aircraft Type'),
      filterKey: 'SearchInput',
      filterVisibilityFlag: true,
    });
    this.lazySearch.lazyCall(() => {
      this.props.applyFilter(SearchFilterConfig(value));
    }, 1000);
  };

  render() {
    const startDate = formattedDate(this.state.StartTime);
    const endDate = formattedDate(this.state.EndTime);
    const startDay = formattedDay(this.state.StartTime);
    const endDay = formattedDay(this.state.EndTime);
    return (
      <div className="header-area">
        <div className="header-area-left">
          <span className="date-range-wrapper" onClick={this.showHideRange}>
            <span className="span-calendar">{startDay}</span>
            <span>{startDate}</span>
            <span className="span-space">-</span>
            <span className="span-calendar">{endDay}</span>
            <span>{endDate}</span>
          </span>
          <DateRangePicker
            show={this.state.showDateRange}
            onHide={this.showHideRange}
            onSelect={this.onDateRangeSelect}
          />
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
          <input type="text" placeholder="search" onChange={this.onSearchInput} />
          <span className="span-notify" />
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ applyFilter }, dispatch);
}

export default connect(null, mapDispatchToProps)(Header);
