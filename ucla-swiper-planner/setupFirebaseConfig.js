const fs = require('fs');
const readline = require('readline');

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const firebaseConfigKeys = [
  'APIKEY',
  'AUTHDOMAIN',
  'DATABASEURL',
  'PROJECTID',
  'STORAGEBUCKET',
  'MESSAGINGSENDERID',
  'APPID',
  'MEASUREMENTID'
];

// Prompt user for Firebase configuration details
function promptUserForConfig(configIndex) {
  if (configIndex >= firebaseConfigKeys.length) {
    rl.close();
    console.log('Firebase configuration saved to .env.local');
    return;
  }

  const key = firebaseConfigKeys[configIndex];
  rl.question('Enter Firebase ' + key + ': ', (value) => {
    const formattedKey = 'NEXT_PUBLIC_FIREBASE_' + key;
    fs.appendFileSync('.env.local', formattedKey + '=' + value + '\n');
    promptUserForConfig(configIndex + 1);
  });
}

// Start prompting user
promptUserForConfig(0);
