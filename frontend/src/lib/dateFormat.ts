import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/es";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.locale("es");

export const DateFormat = (day: string) => {
  // Parsear la fecha 'day' utilizando dayjs y formatear en DD/MM/YYYY
  const formattedDate = dayjs(day).format("DD/MM/YYYY");

  return formattedDate;
};
