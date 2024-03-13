// components/SwipeTracker.js
"use client";
import styles from '../styles/Home.module.css'; // Adjust the import path as needed
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

import { db } from '../../../firebase/FirebaseApp';

import {
    fetchWeeklySwipeSchedule,

} from '../../../firebase/FirebaseUtils';


const auth = getAuth();
const usersRef = collection(db, "Users");
const user = auth.currentUser;

function SwipeTracker() {

    let totalSwipesAvailable;
    let weeklySwipesUsed;
    const [user, setUser] = useState(null);
    const [remainingBalance, setRemainingBalance] = useState(180);
    const [mealPlanType, setMealPlanType] = useState("14p");
    const [swipesUsedThisWeek, setSwipesUsedThisWeek] = useState(0);

    const [swipeMessage, setSwipeMessage] = useState("Please update your profile page."); // New state for the message



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
                    //SWIPES REMAINING FOR THE WEEK
                    const preferenceData = weekEntries[0]["Weekly Swipe Count"];
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
                    const currentDayIndex = days.indexOf(today);

                    Object.keys(sortedData).forEach((day, index) => {
                        if (index <= currentDayIndex || (currentDayIndex === 6 && index === 6)) {
                            intendedSwipes += sortedData[day];
                        }
                    });

                    //remaining swipes for the week  checks if the name is empty or not to see if its a real entry 
                    const sumNonEmptyNames = (loggedSwipes) => {
                        const dayNames = Object.keys(loggedSwipes);
                        let totalSum = 0;

                        dayNames.forEach((day) => {
                            const entries = loggedSwipes[day];
                            const nonEmptyCount = entries.filter((entry) => entry.name !== '').length;
                            totalSum += nonEmptyCount;
                        });

                        return totalSum;
                    };

                    const loggedSwipes = weekEntries[0]["Current Week's Location Swipes"];
                    const nameCounts = sumNonEmptyNames(loggedSwipes);
                    setSwipesUsedThisWeek(nameCounts);

                    //tells you if you are behind or ahead of personalized schedule
                    if (intendedSwipes < swipesUsedThisWeek) {
                        setSwipeMessage(`You have used ${swipesUsedThisWeek - intendedSwipes} more swipes than intended in your profile.`);
                        console.log("swipesUsedThisWeek - intendedSwipes", swipesUsedThisWeek, '-', intendedSwipes)
                    } else if (intendedSwipes > swipesUsedThisWeek) {
                        setSwipeMessage(`You have used ${intendedSwipes - swipesUsedThisWeek} fewer swipes than intended in your profile.`);
                        console.log("intendedSwipes- swipesUsedThisWeek", intendedSwipes, '-', weekly)
                    } else {
                        setSwipeMessage("YOU ARE USING THE CORRECT AMOUNT OF SWIPES LETS GOOOO!!!!");
                    }


                } catch (error) {
                    console.error('Error fetching remaining balance:', error);
                }
            };
            fetchData();
        }

        return () => unsubscribe(); // Cleanup subscription
    }, [user, swipesUsedThisWeek]);

 //set the amount each meal plan starts with and how many swuipes they have left for thwe week 
    if (mealPlanType === "19p") {
        totalSwipesAvailable = 205;
        weeklySwipesUsed = 19 - swipesUsedThisWeek;
    }
    else if (mealPlanType === "14p") {
        totalSwipesAvailable = 150;
        weeklySwipesUsed = 14 - swipesUsedThisWeek;
    }
    else {
        totalSwipesAvailable = 120;
        weeklySwipesUsed = 11 - swipesUsedThisWeek;
    }

    //if the user has not updated profile we dont want to show any data 
    let TSW;

    if (isNaN(totalSwipesAvailable - remainingBalance)) {
        TSW = " Please update your profile page. ";
    } else {
        TSW = totalSwipesAvailable - remainingBalance;
    }


    return (
        <div className={styles.swipeTracker}>
            <h2>Swipe Tracker</h2>
            <p>Total Swipes Used: {TSW}</p>
            <p>Remaining Swipes for the Week: {weeklySwipesUsed}</p>
            {swipeMessage && <p>{swipeMessage}</p>}
        </div>
    );
}

export default SwipeTracker;