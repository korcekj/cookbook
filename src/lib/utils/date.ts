import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import 'dayjs/locale/sk';

dayjs.locale('sk');
dayjs.extend(relativeTime);
dayjs.extend(duration);

export default dayjs;
