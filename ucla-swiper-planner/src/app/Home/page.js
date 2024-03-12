// app/Home/page.js

// Components 
import React from 'react';
import Menu from '../components/Menu';
import SwipeTracker from '../components/SwipeTracker';
import BalanceInfo from '../components/BalanceInfo';
import SignOut from '../components/SignOutButton';

// Styles
import styles from '../styles/Home.module.css'; // Adjust the import path as needed
import Navbar from '../components/navbar';


export default function Home() {
    return (
        <>
            <Navbar />
            <SignOut />
            <div className={styles.container}>
                <main className={styles.main}>
                    <div className={styles.headerContainer}>  {/* Wrap title in new container */}
                        <h1 className={styles.title}>Welcome to UCLA Swipe Planner!</h1>
                    </div>
                    <div className={styles.sideBySide}>  {/* Group swipe tracker and balance info */}
                        <SwipeTracker/>        
                        <BalanceInfo/>
                    </div>
                    <Menu />  {/* Menu below the side-by-side containers */}
                </main>
            </div>
        </>
    );
}