import {Utils} from '../utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export default class FormatTime {
  static getDuration(runtime) {
    const length = dayjs.duration(runtime, `m`);
    const hours = length.hours() ? length.hours() + `h` : ``;
    const minutes = Utils.addLeadZero(length.minutes()) + `m`;

    return `${hours} ${minutes}`;
  }

  static getFullDateMonthAsString(date) {
    return dayjs(date).format(`DD MMMM YYYY`);
  }

  static getFullDateWithTime(date) {
    return dayjs(date).format(`YYYY/MM/DD HH:mm`);
  }

  static getFullYear(date) {
    return dayjs(date).format(`YYYY`);
  }
}
