'use client'
import React, { useState, useEffect } from 'react';
import styles from '../styles/Calendar.module.css';

export function getWeekString() {
  const currentDate = new Date();

  function getStartOfWeek(date) {
    const currentDay = date.getDay();
    const diff = currentDay === 0 ? 6 : currentDay - 1; // Adjust for Sunday
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - diff);
    return startOfWeek;
  }

  function getEndOfWeek(date) {
    const currentDay = date.getDay();
    const diff = currentDay === 0 ? 0 : 7 - currentDay; // Adjust for Sunday
    const endOfWeek = new Date(date);
    endOfWeek.setDate(date.getDate() + diff);
    return endOfWeek;
  }

  const startOfWeek = getStartOfWeek(currentDate);
  const endOfWeek = getEndOfWeek(currentDate);

  const startOfWeekFormatted = startOfWeek.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const endOfWeekFormatted = endOfWeek.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return startOfWeekFormatted + " - " + endOfWeekFormatted;
}

const WeekDatesDisplay = () => {
  const [weekString, setWeekString] = useState('');

  useEffect(() => {
    const updateWeekString = () => {
      const weekString = getWeekString();
      setWeekString(weekString);
    };

    const intervalId = setInterval(updateWeekString, 1000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={styles.CenterText}>
      <h2>{weekString}</h2>
    </div>
  );
};

export default WeekDatesDisplay;
