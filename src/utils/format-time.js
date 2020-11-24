import {addLeadZero} from './common';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export default class FormatTime {
  static fullYear(date) {
    return dayjs(date).format(`YYYY`);
  }

  static duration(runtime) {
    const length = dayjs.duration(runtime, `m`);
    const hours = length.hours() ? length.hours() + `h` : ``;
    const minutes = addLeadZero(length.minutes()) + `m`;

    return `${hours} ${minutes}`;
  }
}
