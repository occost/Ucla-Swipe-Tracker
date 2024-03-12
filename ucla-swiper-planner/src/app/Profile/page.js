// Filename: src/app/components/Profile.js


import styles from '../styles/Profile.module.css'; // Import your CSS file for styling
import SwipePlanner from "../components/UserPreferences.js";
import SignOut from "../components/SignOutButton.js";
import Navbar from '../components/navbar';

const podiumData = [
  { name: "B-Plate", visits: 70 },
  { name: "Epicuria", visits: 60 },
  { name: "De Neve", visits: 30 },
  // Add more restaurant entries as needed
];

const Profile = () => {
  const sortedPodiumData = [...podiumData].sort((a, b) => b.visits - a.visits);

  return (
    <>
      <Navbar />
      <SignOut />
      <SwipePlanner />

    </>
  );
};

export default Profile;  