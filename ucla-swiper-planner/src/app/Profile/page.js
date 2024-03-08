// Filename: src/app/components/Profile.js


import styles from '../styles/Profile.module.css'; // Import your CSS file for styling
import SwipePlanner from "../components/Profile.js";

import Navbar from '../components/Navbar';
import SignOut from '../components/SignOutButton';

const Profile = () => {

  return (
    <>
      <Navbar />
      <SignOut />
      <SwipePlanner />
      <div className={styles.container}>

        <div className={styles.podium}>
          <div className={`${styles.podiumBlock} ${styles.podiumBlock1}`}>
            <p>B-Plate</p>
          </div>
          <div className={`${styles.podiumBlock} ${styles.podiumBlock2}`}>
            <p>Epicuria</p>
          </div>
          <div className={`${styles.podiumBlock} ${styles.podiumBlock3}`}>
            <p>De Neve</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;