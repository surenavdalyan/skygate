import moment from 'moment';

const timeFormatterMMDDHHmm = data => moment(data.value).format('MM/DD HH:mm');

export { timeFormatterMMDDHHmm  };
