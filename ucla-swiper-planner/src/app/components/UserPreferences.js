// Filename: src/app/components/Profile.js

// To inform Next.js that this is a client component
"use client";

// Import useState from 'react' library
import { useState, useEffect } from "react";
import styles from '../styles/Profile.module.css'; // Import your CSS file for styling
import {
  updateWeeklySwipeCount,
  fetchWeeklySwipeSchedule,
  updateMealPlanType,
  fetchMealPlanType,
  updateRemainingBalance
} from '../../../firebase/FirebaseUtils';

import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';

import {
  collection
} from 'firebase/firestore';

import { db } from '../../../firebase/FirebaseApp';

const auth = getAuth();
const usersRef = collection(db, "Users");
const user = auth.currentUser;

const SwipePlanner = () => {
  const [selectedOption, setSelectedOption] = useState("14p"); // Default selection
  const [swipeValues, setSwipeValues] = useState({
    Monday: 2,
    Tuesday: 2,
    Wednesday: 2,
    Thursday: 2,
    Friday: 2,
    Saturday: 2,
    Sunday: 2,
  });
  const [message, setMessage] = useState(""); // Initialize message state with a default value
  const [user, setUser] = useState(null); // Initialize user state
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state when auth state changes
    });
  
    if (user) {
      const fetchData = async () => {
        try {
          console.log(user);
          console.log('tableData', swipeValues);
          const weekEntries = await fetchWeeklySwipeSchedule();
          const formattedData = weekEntries[0]["Weekly Swipe Count"]; // Assuming fetchWeeklySwipeSchedule needs the user's UID
          const fetchedPlan = weekEntries[0]["Meal Plan Type"];
          console.log("fetched plane tpye fetchedPlan ");
          console.log(fetchedPlan);
          // Sort the swipe values by days of the week
          const sortedData = Object.keys(formattedData).sort((a, b) => {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            return days.indexOf(a) - days.indexOf(b);
          }).reduce((obj, key) => {
            obj[key] = formattedData[key];
            return obj;
          }, {});
  
          setSwipeValues(sortedData);
          setSelectedOption(fetchedPlan || "14p"); // Set selected option to fetchedPlan if it exists, otherwise default to "14p"

        } catch (error) {
          console.error('Error fetching "week Entries":', error);
        }
      };
  
      fetchData();
    }
  
    return () => unsubscribe(); // Cleanup subscription
  }, [user]);

  // Function to handle option change
  const handleOptionChange = (option,day) => {

    const newSwipeValues = { ...swipeValues };
    newSwipeValues[day] = Math.max(0, newSwipeValues[day]); // Ensure swipe values don't go below 0

    // Order the days of the week
    const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const orderedSwipeValues = {};

    orderedDays.forEach(day => {
      orderedSwipeValues[day] = newSwipeValues[day] || 0; // Set swipe value to 0 if it doesn't exist
    });
   
    setSwipeValues(orderedSwipeValues);
    updateWeeklySwipeCount(orderedSwipeValues);
    
    setSelectedOption(option);

    // Update swipe values based on the selected option
    if (option === "14p") {
      setSwipeValues({
        Monday: 2,
        Tuesday: 2,
        Wednesday: 2,
        Thursday: 2,
        Friday: 2,
        Saturday: 2,
        Sunday: 2,
      });
    } else if (option === "19p") {
      setSwipeValues({
        Monday: 3,
        Tuesday: 3,
        Wednesday: 3,
        Thursday: 3,
        Friday: 3,
        Saturday: 2,
        Sunday: 2,
      });
    } else {
      // Default option "11p" or any other option
      setSwipeValues({
        Monday: 2,
        Tuesday: 2,
        Wednesday: 2,
        Thursday: 2,
        Friday: 1,
        Saturday: 1,
        Sunday: 1,
      });
    }

    setMessage("You are using a valid amount of Swipes"); // Clear the message when changing the option
    updateMealPlanType(option);
    
  };

  // Function to handle swipe value change for a day
  const handleSwipeChange = (day, direction) => {
    const newSwipeValues = { ...swipeValues };
    newSwipeValues[day] = Math.max(0, newSwipeValues[day] + direction); // Ensure swipe values don't go below 0

    // Order the days of the week
    const orderedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const orderedSwipeValues = {};

    orderedDays.forEach(day => {
      orderedSwipeValues[day] = newSwipeValues[day] || 0; // Set swipe value to 0 if it doesn't exist
    });

    // Check if the total swipes meet the limit
    const totalSwipes = Object.values(orderedSwipeValues).reduce((total, value) => total + value, 0);
    const limit = selectedOption === "11p" ? 11 : selectedOption === "14p" ? 14 : 19;

    if (totalSwipes > limit) {
      setMessage(`You are using ${totalSwipes - limit} swipes over the limit`);
    } else if (totalSwipes < limit) {
      setMessage(`You have ${limit - totalSwipes} swipes less than the limit`);
    } else {
      setMessage("You are using a valid amount of Swipes"); // Clear the message if total swipes meet the limit
    }

    setSwipeValues(orderedSwipeValues);
    updateWeeklySwipeCount(orderedSwipeValues);
  };

  const [currentSwipes, setCurrentSwipes] = useState(""); // State to manage the entered number

  const handleCurrentSwipesChange = (e) => {
    // Update the state when the input value changes
    setCurrentSwipes(e.target.value);
    updateRemainingBalance(currentSwipes);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      updateRemainingBalance(currentSwipes);
      setCurrentSwipes("");
    }
  };

  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>WELCOME TO THE PROFILE PAGE</h1>

      <div className={styles.explanationBox}>
        <p className={styles.explanationText}>
          This is the Profile Page where you will set the amount of swipes you would like to use each day.
          We will use this information to display how many swipes you should have for the remaining week.
          You can also update the current amount of swipes you have right now! This will give us an accurate
          representation about how on track you actually are. Below that features your Lunch-Wrapped! 
          Discover your top 3 visited dining halls or takeout favorites, a review of your culinary adventures.
        </p>
      </div>

      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${selectedOption === "11p" && styles.selected}`}
          onClick={() => handleOptionChange("11p")}
        >
          11p
        </button>
        <button
          className={`${styles.button} ${selectedOption === "14p" && styles.selected}`}
          onClick={() => handleOptionChange("14p")}
        >
          14p
        </button>
        <button
          className={`${styles.button} ${selectedOption === "19p" && styles.selected}`}
          onClick={() => handleOptionChange("19p")}
        >
          19p
        </button>
      </div>

      <div>
        <form className={styles.formContainer} >
          <label className={styles.formLabelCont}>
            Update Current Swipes:
            <input
              type="number"
              value={currentSwipes}
              onChange={handleCurrentSwipesChange} 
              onKeyPress={handleKeyPress}
            />
          </label>
          <div className={styles.updateSwipes}>
            <div className={styles.p}>
              <a href="https://myhousing.hhs.ucla.edu/shib/swipes" target="_blank" rel="noopener noreferrer">Check Real-Time Swipes</a>
            </div>
          </div>
        </form>
      </div>

      <h4 className={styles.customP1}>Hit Enter To Save Swipes</h4>

      <table className={styles.table}>
        <thead>
          <tr>
            {Object.keys(swipeValues).map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.keys(swipeValues).map((day) => (
              <td key={day}>
                {swipeValues[day]}
                <div className={styles.adjustButtons}>
                  <button onClick={() => handleSwipeChange(day, -1)}>-</button>
                  <button onClick={() => handleSwipeChange(day, 1)}>+</button>
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      {message && <div className={styles.message}>{message}</div>}

      <button className={`${styles.button} ${styles.saveButton}`} >
        Save
      </button>

      <h2 className={styles.podiumMessage}>
        Your Lunch-Wrapped UPDATED
      </h2>
    </div>
  );
};

export default SwipePlanner;
