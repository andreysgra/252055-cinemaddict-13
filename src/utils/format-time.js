import {Utils} from '../utils';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default class FormatTime {
  static getDuration(runtime) {
    const hours = FormatTime.getDurationHours(runtime);
    const minutes = FormatTime.getDurationMinutes(runtime);

    return `${hours ? hours + `h` : ``} ${Utils.addLeadZero(minutes) + `m`}`;
  }

  static getDurationHours(runtime) {
    return Math.floor(dayjs.duration(runtime, `m`).asHours());
  }

  static getDurationMinutes(runtime) {
    return dayjs.duration(runtime, `m`).minutes();
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

  static getHumanizeDate(date) {
    const dateNow = dayjs();
    const dateComment = dayjs(date);

    const seconds = dateNow.diff(dateComment, `second`);
    const minutes = dateNow.diff(dateComment, `minute`);
    const hours = dateNow.diff(dateComment, `hour`);
    const days = dateNow.diff(dateComment, `day`);
    const months = dateNow.diff(dateComment, `month`);
    const years = dateNow.diff(dateComment, `year`);

    if (seconds < 60) {
      return dayjs.duration(-seconds, `second`).humanize(true);
    }

    if (minutes >= 1 && minutes < 60) {
      return dayjs.duration(-minutes, `minute`).humanize(true);
    }

    if (hours >= 1 && hours < 24) {
      return dayjs.duration(-hours, `hour`).humanize(true);
    }

    if (days >= 1 && days <= 30) {
      return dayjs.duration(-days, `day`).humanize(true);
    }

    if (months >= 1 && months <= 12) {
      return dayjs.duration(-months, `month`).humanize(true);
    }

    return dayjs.duration(-years, `year`).humanize(true);
  }
}
