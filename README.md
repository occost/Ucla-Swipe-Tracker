# swiper-no-swiping
### UCLASwipeTracker is designed with UCLA Bruins in mind, aiming to revolutionize the way you use and manage your meal plan. Embrace a smarter way to dine on campus, tailored to your preferences and dietary needs. Let UCLASwipeTracker guide you not just eat but to FEAST!

#### To check a currently deployed version of UCLA Swipe Tracker please visit: https://swiper-no-swiping-ca90d.web.app/
Disclaimer: We scrape UCLA's menus for a week in advance and the dining options are subject to change so what  is displayed might not be 100% accurate for that day.

## Features
* **Customizable Calendar:** Plan out your daily swipes on the Calendar Page to track usage and favorite dining spots. Simply use drop-down menus to create entries, then confirm and send updates for seamless account management.
* **Weekly Menus:** Explore our UCLA Dining Menus on our webpage to discover daily culinary offerings. Navigate through menus and stay updated on the latest dining hall and takeout choices. 
* **Swipe Tracker:** Select your meal plan and set your daily swipe limit on the Profile Page. Track daily swipe usage for accurate monitoring of your weekly dining activity.
* **Meal Swipe Balance:** Monitor your swipe usage throughout the week on our Home Page, gaining insights into the number of swipes used and remaining, helping you stay on track with your preferred meal plan.

## Technologies
* ### Firebase <img src="https://seeklogo.com/images/F/firebase-logo-402F407EE0-seeklogo.com.png" alt="Firebase" width="23px">
* ### Javascript <img src="https://seeklogo.com/images/J/javascript-logo-8892AEFCAC-seeklogo.com.png" alt="javascript" width="27px">
* ### Node.js <img src="https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png" alt="Node.js" width="30px">
* ### Next.js <img src="https://seeklogo.com/images/N/next-js-icon-logo-EE302D5DBD-seeklogo.com.png" alt="Next.js" width="35px">
* ### React.js <img src="https://seeklogo.com/images/R/react-logo-7B3CE81517-seeklogo.com.png" alt="React.js" width="30px">

## Components
* **Balance Info:** Fetches user data from Firebase, calculates remaining meal swipes, and displays a message based on the user's meal plan and swipe usage.
* **Calendar:** Manages a calendar for tracking meal swipes, allowing users to add, clear, and update entries for each day of the week.
* **Fetching Daily Menu:** Defines functions to fetch breakfast, lunch, and dinner menus from a JSON server.
* **Menu:** Fetches today's menu from a dynamically imported JSON file based on the current date and displays the options categorized by meal type and dining locations.
* **Navbar:** Defines a Navbar component with navigation links styled using CSS from the Navbar module, facilitating page navigation in a Next.js application.
* **Profile:**  Enables users to plan weekly meal swipes by selecting preset options and adjusting swipe values for each day, accompanied by feedback messages.
* **SignIn:** Allows users to sign in with Google, utilizing Firebase authentication and upon successful sign-in, users are redirected to the Home page.
* **SignOut:** Allows users that are authenticated with Firebase to sign-out in which users are redirected to the home or login page.
* **SwipeTracker:** Tracks the number of swipes used and remaining for the week, based on the user's meal plan.
* **User Preferences:** Manages and updates the user's daily swipe preferences and current swipe balance.
* **Weekdates:** Calculates and displays the current week's dates which determines the current academic week based on predefined quarter start and end dates.
* **Wheel:** Creates a spinning wheel to randomly select a dining hall or takeout location when a user is indecisive about what to eat for a particular meal.

## Frontend
#### 

## Backend
#### UCLASwipeTracker leverages Firebase to store and manage user data, swipe tracking, and even retrieve weekly menus. Here's a breakdown of how it works:

**Firebase Configuration:**
The backend starts by setting up the connection to Firebase using firebase.initializeApp(). This function requires your project's specific configuration details, essentially acting like a handshake between your app and Firebase.

**Firestore:**
Firestore is a document-based structure where each user has a dedicated document within a "Users" collection. This document retrieves and stores details like: Meal Plan Type, Remaining Swipe Balance, Weekly Swipe Count, and Last Logged Entry. 

**API Triggers:**
* User Login: Firebase Authentication validates each user's credentials. Once logged in, the backend fetches user data from Firestore using the Admin SDK. This allows secure access to information like remaining swipes through a unique UID.
* Swipe Tracking: Whenever a swipe is used, an API call updates the user's swipe count in Firestore. This likely involves decrementing the value stored for remaining_swipes.
* Calendar Management: Adding, removing, or updating planned swipes in the calendar triggers API interactions with Firestore.

**Web Scraping:**
A separate Python script runs periodically to fetch menus from UCLA Dining's server. This script uses libraries like requests to grab the menu data in JSON format. The script then processes the fetched data, extracts relevant menu information for the upcoming week, and organizes it into a suitable structure.

## Setup

## Contributors
_UCLASwipeTracker_ was made as a project for **CS 35L** taught by Professor Paul Eggert at UCLA in Winter 2024. **Made by**: Oscar Cooper Stern, Danny Dang, Rhea Jain, 
David Su, Eideen Mozaffari.
