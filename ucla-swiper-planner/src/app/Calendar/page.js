// Calendar/page.js

// Filename: src/app/components/Calendar.js

// Components
import Wheel from "../components/Wheel.js";
import Calendar from "../components/Calendar.js";
//import WeekDatesDisplay from '../components/weekDates.js';
import WeekDatesDisplay from '../components/WeekDates.js';



const CalendarPage = () => {
 
  return (
   <>
    <h1>Welcome To The Calendar Page!</h1>
    <WeekDatesDisplay></WeekDatesDisplay>
    <Calendar />
    <Wheel />
   </>
  );
};

export default CalendarPage;