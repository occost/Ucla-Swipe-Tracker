"use client";

// Import useState from 'react' library
import { useState, useEffect } from "react";
import { fetchRemainingBalance } from '../../../firebase/FirebaseUtils';

import {
  getAuth,
  onAuthStateChanged
} from 'firebase/auth';

import {
  collection
} from 'firebase/firestore';

import {
  fetchWeeklySwipeSchedule,

} from '../../../firebase/FirebaseUtils';

import { db } from '../../../firebase/FirebaseApp';

import { calculateCurrentWeek } from "./WeekDates";

const auth = getAuth();
const usersRef = collection(db, "Users");
const user = auth.currentUser;
// Styles
import styles from '../styles/Home.module.css';

function BalanceInfo() {
  const { currentWeek, currentQuarter } = calculateCurrentWeek();
  let totalSwipesAvailable;
  let swipesPerWeek;
  const [user, setUser] = useState(null);
  const [remainingBalance, setRemainingBalance] = useState('140');
  const [mealPlanType, setMealPlanType] = useState("14p");
  const [intendedData, setintendedData] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state when auth state changes
    });

    if (user) {
      const fetchData = async () => {
        try {
          console.log(user);
          const swipesLeft = await fetchRemainingBalance();
          setRemainingBalance(swipesLeft[0]["Remaining Balance"]);
          setMealPlanType(swipesLeft[0]["Meal Plan Type"])

          const weekEntries = await fetchWeeklySwipeSchedule();
          //for how many swipes they should have remaing 
          const preferenceData = weekEntries[0]["Weekly Swipe Count"];
          //to rearragne unordered firebase data
          const sortedData = Object.keys(preferenceData).sort((a, b) => {
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            return days.indexOf(a) - days.indexOf(b);
          }).reduce((obj, key) => {
            obj[key] = preferenceData[key];
            return obj;
          }, {});


          let intendedSwipes = 0;
          const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }); // Get the current day
          const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

          //we need the current day to tell them how much they intended to use this week 
          const currentDayIndex = days.indexOf(today);
          Object.keys(sortedData).forEach((day, index) => {
            //sum all of the intended swipes including the day they are on 
            if (index <= currentDayIndex ) {
              intendedSwipes += sortedData[day];
            }
          });

          setintendedData(intendedSwipes);


        } catch (error) {
          console.error('Error fetching remaining balance:', error);
        }
      };
      fetchData();
    }

    return () => unsubscribe(); // Cleanup subscription
  }, [user]);
  if (mealPlanType === "19p") {
    totalSwipesAvailable = 205;                //start of the quarter swipes 
    swipesPerWeek = 19;
  }
  else if (mealPlanType === "14p") {
    totalSwipesAvailable = 150;                    //start of the quarter swipes 
    swipesPerWeek = 14;
  }
  else {
    totalSwipesAvailable = 120;                  //start of the quarter swipes 
    swipesPerWeek = 11;
  }

  // total of what they start at the beginning of the quarter - all swipes shouldve used up until last week - how much they indeded to use 
  let trackingMessage;
  if(remainingBalance > totalSwipesAvailable - ((currentWeek - 1) * swipesPerWeek) - intendedData){
    trackingMessage="Wow, you've got extra swipes to spare!";
  }
  else if (remainingBalance < totalSwipesAvailable - ((currentWeek - 1) * swipesPerWeek) - intendedData){
    trackingMessage= "Uh oh, it seems you're using swipes faster than expected"
  }
  else{
   trackingMessage= "You're right on target with your meal swipes! Keep it up!"
  }


  return (
    <div className={styles.balanceInfo}>
      <h2>Meal Swipe Balance</h2>
      <p>You have {remainingBalance} swipes remaining.</p>
      <p>You should have {totalSwipesAvailable - ((currentWeek - 1) * swipesPerWeek) - intendedData} swipes remaining.</p>
      <p>{trackingMessage}</p>
    </div>
  );
}

export default BalanceInfo;
