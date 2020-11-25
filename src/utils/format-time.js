import Utils from '../utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export default class FormatTime {
  static duration(runtime) {
    const length = dayjs.duration(runtime, `m`);
    const hours = length.hours() ? length.hours() + `h` : ``;
    const minutes = Utils.addLeadZero(length.minutes()) + `m`;

    return `${hours} ${minutes}`;
  }

  static fullDateMonthAsString(date) {
    return dayjs(date).format(`DD MMMM YYYY`);
  }

  static fullDateWithTime(date) {
    return dayjs(date).format(`YYYY/MM/DD HH:mm`);
  }

  static fullYear(date) {
    return dayjs(date).format(`YYYY`);
  }
}
