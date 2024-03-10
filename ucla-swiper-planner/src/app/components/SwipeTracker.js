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

function SwipeTracker({ totalSwipesAvailable, weeklySwipesUsed }) {

    const [user, setUser] = useState(null);
    const [remainingBalance, setRemainingBalance] = useState(180);
    const [mealPlanType, setMealPlanType] = useState("14p");
    const [swipesUsedThisWeek, setSwipesUsedThisWeek] = useState(0);

    const [swipeMessage, setSwipeMessage] = useState(""); // New state for the message



    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Update user state when auth state changes
        });

        if (user) {
            const fetchData = async () => {
                try {
                    console.log(user);
                    const swipesLeft = await fetchRemainingBalance();
                    console.log(swipesLeft[0]["Remaining Balance"]);
                    setRemainingBalance(swipesLeft[0]["Remaining Balance"]);
                    setMealPlanType(swipesLeft[0]["Meal Plan Type"])

                    //remaining swipes for week
                    const weekEntries = await fetchWeeklySwipeSchedule();
                    const formattedData = weekEntries[0]["Current Week's Location Swipes"];
                    const arrayLengths = Object.values(formattedData).map(dayArray => dayArray.length);
                    const sumOfArrayLengths = arrayLengths.reduce((sum, length) => sum + length, 0);
                    const modifiedSum = sumOfArrayLengths - 7;
                    console.log("swipesUsedThisWeek: ", modifiedSum)
                    setSwipesUsedThisWeek(modifiedSum);

                    //swipes message
                    const preferenceData = weekEntries[0]["Weekly Swipe Count"];
                    const sortedData = Object.keys(preferenceData).sort((a, b) => {
                        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                        return days.indexOf(a) - days.indexOf(b);
                    }).reduce((obj, key) => {
                        obj[key] = preferenceData[key];
                        return obj;
                    }, {});

                    console.log("sortedData: ", sortedData);

                    let intendedSwipes = 0;
                    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }); // Get the current day
                    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                    const currentDayIndex = days.indexOf(today);

                    Object.keys(sortedData).forEach((day, index) => {
                        if (index < currentDayIndex) {
                            intendedSwipes += sortedData[day]; 
                        }
                        console.log(day,"intendedSwipes",intendedSwipes);
                    });

                   // 10    8
                    if (intendedSwipes < swipesUsedThisWeek) {
                        setSwipeMessage(`You have used ${swipesUsedThisWeek -weeklySwipesUsed } more swipes than intended in your profile.`);
                    } else if (intendedSwipes > swipesUsedThisWeek) {
                        setSwipeMessage(`You have used ${intendedSwipes- weeklySwipesUsed} fewer swipes than intended in your profile.`);
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
    }, [user]);

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



    return (
        <div className={styles.swipeTracker}>
            <h2>Swipe Tracker</h2>
            <p>Total Swipes Used: {totalSwipesAvailable - remainingBalance}</p>
            <p>Remaining Swipes for the Week: {weeklySwipesUsed}</p>
            {swipeMessage && <p>{swipeMessage}</p>}
        </div>
    );
}

export default SwipeTracker;