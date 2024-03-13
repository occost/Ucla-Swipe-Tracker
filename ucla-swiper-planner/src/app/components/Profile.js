// Filename: src/app/components/Profile.js

// To inform Next.js that this is a client component
"use client";

// Import useState from 'react' library
import { useState, useEffect} from "react";
import styles from '../styles/Profile.module.css'; // Import your CSS file for styling
import { db } from "../../../firebase/FirebaseApp";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import {
  fetchWeeklySwipeSchedule,
  fetchAllTimeSwipes,
  fetchWeeklySwipesForLocations,
  updateWeeklySwipeCount,
  updateAllTimeSwipes,
  updateWeeklySwipesForLocations 
} from "../../../firebase/FirebaseUtils"

const auth = getAuth();
const usersRef = collection(db, "Users");

const SwipePlanner = () => {
  const [selectedOption, setSelectedOption] = useState("11p"); // Default selection
  const [swipeValues, setSwipeValues] = useState({
    Mon: 2,
    Tue: 2,
    Wed: 2,
    Thu: 2,
    Fri: 1,
    Sat: 1,
    Sun: 1,
  });
  const [message, setMessage] = useState("You are using a valid amount of swipes"); // Message for swipe limit

  // Function to handle option change
  const handleOptionChange = async (option) => {
    setSelectedOption(option);
  
    // Update swipe values based on the selected option
    let newSwipeValues;
    if (option === "14p") {
      newSwipeValues = {
        Mon: 2,
        Tue: 2,
        Wed: 2,
        Thu: 2,
        Fri: 2,
        Sat: 2,
        Sun: 2,
      };
    } else if (option === "19p") {
      newSwipeValues = {
        Mon: 3,
        Tue: 3,
        Wed: 3,
        Thu: 3,
        Fri: 3,
        Sat: 2,
        Sun: 2,
      };
    } else {
      // Default option "11p" or any other option
      newSwipeValues = {
        Mon: 2,
        Tue: 2,
        Wed: 2,
        Thu: 2,
        Fri: 1,
        Sat: 1,
        Sun: 1,
      };
    }
  //sends to the firebase everytime they switch option
    await setSwipeValues(newSwipeValues);
    await updateWeeklySwipeCount(newSwipeValues);
  
    setMessage("You are using a valid amount of Swipes"); // Clear the message when changing the option
  };
  

  // Function to handle swipe value change for a day
  const handleSwipeChange = async (day, direction) => {
    //copies swipeValues and adds or subtracts from the index they chose 
    const newSwipeValues = { ...swipeValues };
    newSwipeValues[day] = Math.max(0, newSwipeValues[day] + direction); // Ensure swipe values don't go below 0

    // Check if the total swipes meet the limit
    const totalSwipes = Object.values(newSwipeValues).reduce((total, value) => total + value, 0);
    const limit = selectedOption === "11p" ? 11 : selectedOption === "14p" ? 14 : 19;

    //sets message based on if they are on track 
    if (totalSwipes > limit) {
      setMessage(`You are using ${totalSwipes - limit} swipes over the limit`);
    } else if (totalSwipes < limit) {
      setMessage(`You have ${limit - totalSwipes} swipes less than the limit`);
    } else {
      setMessage("You are using a valid amount of Swipes"); // Clear the message if total swipes meet the limit
    }  

    await setSwipeValues(newSwipeValues);
    await updateWeeklySwipeCount(newSwipeValues);
  };

  return (
    <div className={styles.container}>
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

    </div>
  );
};

export default SwipePlanner;
