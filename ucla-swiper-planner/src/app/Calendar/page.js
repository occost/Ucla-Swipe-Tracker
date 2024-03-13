// Calendar/page.js

// Filename: src/app/components/Calendar.js

// Components
import Wheel from "../components/Wheel.js";
import Calendar from "../components/Calendar.js";
import styles from '../styles/Calendar.module.css';
import Navbar from "../components/navbar.js";
import SignOut from "../components/SignOutButton.js";

//import WeekDatesDisplay from '../components/weekDates.js';
import WeekDatesDisplay from '../components/WeekDates.js';



const CalendarPage = () => {
 
  return (
   <>
    <Navbar />
    <SignOut />
    <h1 className={styles.Welcome}>Welcome To The Calendar Page!</h1>
    <div className={styles.explanationBox}>
        <styles.P1 className={styles.explanationText}>
          This is the Calendar Page where you will log the swipes you use for each day.
          We will use this information to track and display how many swipes you have used and where you have eaten the most.
          Create your swipe entry using the drop down menus, and press "Confirm" to finish creating your entry. 
          Once you are done logging your swipes, press "Send Update" to update your account with your new entries. Happy swiping!
        </styles.P1>
      </div>
    <WeekDatesDisplay></WeekDatesDisplay>
    <Calendar />
    <Wheel />
   </>
  );
};

export default CalendarPage;