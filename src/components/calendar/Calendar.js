import styles from "./Calendar.module.css";
import CalendarDay from "./CalendarDay";

const Calendar = (props) => {
  // Get the length of one day in miliseconds
  const DAY_TO_UTC = 24 * 60 * 60 * 1000;

  // Variable to store the weeks of the month
  let cal = [];

  const month = +props.forMonth;
  const year = +props.forYear;
  const daysInMonth = 32 - new Date(year, month, 32).getDate();

  const dayOfFirst = new Date(year, month, 0).getDay();
  // Get days of previous month
  cal.push([]);
  if (dayOfFirst !== 0) {
    const daysToFirstOfThisMonth = dayOfFirst;
    const theFirstOfThisMonth = +new Date(year, month, 1);
    let startDate = theFirstOfThisMonth - daysToFirstOfThisMonth * DAY_TO_UTC;
    for (
      let index = startDate;
      index < theFirstOfThisMonth;
      index += 24 * 60 * 60 * 1000
    ) {
      cal[0].push(index);
    }
  }

  // Get days of current month
  let startDate = +new Date(year, month, 1);
  let dayOfWeek = dayOfFirst;
  let daysInMonthUTC = startDate + daysInMonth * DAY_TO_UTC;
  while (startDate <= daysInMonthUTC) {
    if (dayOfWeek > 6) {
      dayOfWeek = 0;
      cal.push([]);
    }
    cal[cal.length - 1].push(startDate);
    startDate += DAY_TO_UTC;
    dayOfWeek++;
  }

  // Get days of next month
  if (dayOfWeek !== 7) {
    let date = daysInMonthUTC + DAY_TO_UTC;
    for (let index = dayOfWeek; index <= 6; index++) {
      cal[cal.length - 1].push(date);
      date += DAY_TO_UTC;
    }
  }

  return (
    <table className={styles.calendar}>
      <thead>
        <tr>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
          <th>Sun</th>
        </tr>
      </thead>
      <tbody>
        {cal.map((week, weekIndex) => {
          return (
            <tr key={weekIndex}>
              {week.map((day, dayIndex) => {
                return (
                  <CalendarDay
                    key={dayIndex}
                    dateUTC={day}
                    markedDate={props.markedDate}
                    onSelectDate={props.onSelectDate}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default Calendar;
