// app/page.js

// Components 
import React from 'react';
import Menu from './components/Menu'; // Adjust the import path as needed
import SignIn from './components/SignInButton';

// Styles
import styles from './styles/Home.module.css'; // Adjust the import path as needed




export default function Home() {
    // Here, you'd replace mockData with actual data fetched from your database

    return (
        <>
            <SignIn />
            <div className={styles.container}>
                <main className={styles.main}>
                    <h1 className={styles.title}>Welcome to UCLA Swipe Tracker!</h1>
                    <h3>Our Mission</h3>
                    <p>
                      UCLA Swipe Tracker is designed with UCLA Bruins in mind, aiming to 
                        revolutionize the way you use and manage your meal plan.
                         From tracking your dining hall swipes to planning your meals 
                         throughout the quarter, UCLASwipeTracker ensures you're making the
                          most out of every swipe. With features like a customizable calendar,
                           daily swipe logging, and insights on all-time swipe statistics, we 
                           make it easier than ever to monitor your meals, discover weekly menus, 
                            and enjoy a seamless meal selection experience. Embrace a smarter way to dine on campus, 
                            tailored to your preferences and dietary needs. Let UCLA Swipe Tracker guide you
                            not just eat but to FEAST!
                    </p>
                    <Menu />
                </main>
            </div>
        </>
    );
}