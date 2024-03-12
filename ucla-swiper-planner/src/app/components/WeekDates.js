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


export function calculateCurrentWeek() {
  const quarters = {
    fall: { start: new Date('2023-10-02'), end: new Date('2023-12-15') },
    winter: { start: new Date('2024-01-08'), end: new Date('2024-03-22') },
    spring: { start: new Date('2024-04-01'), end: new Date('2024-06-14') },
  };

  const now = new Date();

  for (const [quarter, dates] of Object.entries(quarters)) {
    if (now >= dates.start && now <= dates.end) {
      const weekDifference = Math.floor((now - dates.start) / (7 * 24 * 60 * 60 * 1000)) + 1;
      return { currentWeek: weekDifference, currentQuarter: quarter };
    }
  }

  return { currentWeek: null, currentQuarter: null };
}
