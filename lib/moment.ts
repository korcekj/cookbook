import 'moment/locale/sk';
import moment from 'moment';
import humanizeDuration from 'humanize-duration';

const language = 'sk';

moment.locale(language);

export const humanizeMinutes = (minutes: number = 0) => {
  return humanizeDuration(minutes * 60 * 1000, {
    language,
    units: ['h', 'm'],
  });
};

export default moment;
