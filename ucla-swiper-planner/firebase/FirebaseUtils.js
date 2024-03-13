import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import app from "./FirebaseApp"
import { db } from './FirebaseApp';
import { getAuth } from "firebase/auth";


const auth = getAuth(app);
const usersRef = collection(db, "Users");

export async function fetchFireStoreData(){
  const user = auth.currentUser;
  const q = query(usersRef, where("uid", "==", user.uid)); // we look in our documents for the one titled with the current user's id
  const userData = [];
  try {
    const querySnapshot = await getDocs(q); //add each user document that matches to the array (should only be one)
    querySnapshot.forEach((doc) => {
    userData.push(doc.data());
    });
  } catch (error) {
    console.log("Error getting documents: ", error);
  }
  return userData; //will return an empty array if no user is found (IMPORTANT BEHAVIOR)
}

export async function fetchRemainingBalance(){
  const userInfo = await fetchFireStoreData();
  const swipes=userInfo[0]["Remaning Balance"]
  console.log(swipes);
  return userInfo; //gets the users balance from firebase (not really, we return all their data, but the code is designed around this behavior now)
}
export async function fetchAllTimeSwipes() {
  const userInfo = await fetchFireStoreData();
  const swipes=userInfo[0]["All Time Swipes"]
  return userInfo; //same as remaining balance
}

export async function fetchWeeklySwipesForLocations() {
  const userInfo = await fetchFireStoreData();
  const swipes=userInfo[0]["Current Week's Location Swipes"]
  return userInfo; //same as remaining balance
}

  
export async function fetchWeeklySwipeSchedule() {
  const userInfo = await fetchFireStoreData();
  const swipes=userInfo[0]["Weekly Swipe Count"]
  console.log(swipes);
  return userInfo; //same as remaining balance
}

export async function fetchMealPlanType() {
  const userInfo = await fetchFireStoreData();
  const swipes=userInfo[0]["Meal Plan Type"]
  console.log(swipes);
  return userInfo; //same again
}

export async function fetchLastLoggedEntry() {
  const userInfo = await fetchFireStoreData();
  const log=userInfo[0]["Last Entry Log"]
  console.log(log);
  return log; //WE DO IT CORRECT HERE!!!!
}

export async function updateLastLoggedEntry(date) {
  const user = auth.currentUser;
  const userRef = doc(db, "Users", user.uid); //get the document relating to the user's id
  
  try {
    await setDoc(userRef, { "Last Entry Log": date }, { merge: true }); //update the user's time updating their calendar
    console.log("Last Log updated successfully");
  } catch (error) {
    console.error("Last Log Updated Successfully: ", error);
  }
}

 
  
export async function updateWeeklySwipeCount(newCount) {
  const user = auth.currentUser;
  const userRef = doc(db, "Users", user.uid);
  
  try {
    await setDoc(userRef, { "Weekly Swipe Count": newCount }, { merge: true }); //update weekly sweipe count in the db
    console.log("Weekly Swipe Count updated successfully");
  } catch (error) {
    console.error("Error updating Weekly Swipe Count: ", error);
  }
}

export async function updateRemainingBalance(newCount) {
  const user = auth.currentUser;
  const userRef = doc(db, "Users", user.uid);
  
  try {
    await setDoc(userRef, { "Remaining Balance": newCount }, { merge: true }); //update their balance in the db
    console.log("Remaining Balance updated successfully");
  } catch (error) {
    console.error("Error updating Remaining Balance: ", error);
  }
}


export async function updateMealPlanType(newCount) { //same idea again, pretty obvious whats happening
  const user = auth.currentUser;
  const userRef = doc(db, "Users", user.uid);
  
  try {
    await setDoc(userRef, { "Meal Plan Type": newCount }, { merge: true });
    console.log("Updated Meal Plan Type");
  } catch (error) {
    console.error("Error updating Meal Plan Type: ", error);
  }
}

export async function initNewUser(newLogIn){
  const user = newLogIn.currentUser;
  const userRef = doc(db, "Users", user.uid);

  try{
    await setDoc(userRef, { "uid": user.uid }, { merge: true }); //we create a user with the uid, which is all we need, so that we can start modify their db entry
    console.log("Initalized a new user");
  //  await setDoc(userRef, { "Last Entry Log": user.uid }, { merge: true });
  }catch(error){
    console.error("Initalizing a new user: ", error);
  }
}

export async function updateAllTimeSwipes(newCount) { //we dont even use this :)
  const user = auth.currentUser;
  const userRef = doc(db, "Users", user.uid);

  try {
      // Fetch the current user data
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();

      // Update the all-time swipes
      const oldAllTimeSwipes = userData["All Time Swipes"] || {};
      const updatedAllTimeSwipes = {};

      // Add the oldAllTime entries
      for (const location in oldAllTimeSwipes) {
          updatedAllTimeSwipes[location] = oldAllTimeSwipes[location];
      }

      // Add the swipes for the current week
      const currentWeekSwipes = await fetchWeeklySwipesForLocations();
      for (const location in currentWeekSwipes) {
          updatedAllTimeSwipes[location] = (updatedAllTimeSwipes[location] || 0) + currentWeekSwipes[location];
      }

      // Update the document in Firestore
      await setDoc(userRef, { "All Time Swipes": updatedAllTimeSwipes }, { merge: true });
      console.log("All Time Swipes updated successfully");
  } catch (error) {
      console.error("Error updating All Time Swipes: ", error);
  }
}

export async function updateWeeklySwipesForLocations(newCount) { //new count is an array of amps or a map of arrays, and we update its entry
  const user = auth.currentUser;
  const userRef = doc(db, "Users", user.uid);
  
  try {
    await setDoc(userRef, { "Current Week's Location Swipes": newCount }, { merge: true });
    console.log("Weekly Swipes for Locations updated successfully");
  } catch (error) {
    console.error("Error updating Weekly Swipes for Locations: ", error);
  }
}