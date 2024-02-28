// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyAM4Kcn7TiouJ61Kr-2IdCMysk7-WGoUMo",
    authDomain: "jsv-dashboard-bb601.firebaseapp.com",
    databaseURL: "https://jsv-dashboard-bb601-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "jsv-dashboard-bb601",
    storageBucket: "jsv-dashboard-bb601.appspot.com",
    messagingSenderId: "577316282958",
    appId: "1:577316282958:web:dbce810e96ad9fd20f991f",
    measurementId: "G-FG38VK1BPV"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  var db = firebase.database();
  
  function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
  
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(userCredential) {
        // Signed in
        var user = userCredential.user;
        showView(user);
      })
      .catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorMessage);
      });
  }
  
  function logout() {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      document.getElementById('adminView').style.display = 'none';
      document.getElementById('userView').style.display = 'none';
      document.getElementById('login').style.display = 'block';
    }).catch(function(error) {
      console.error(error);
    });
  }
  
  function showView(user) {
    db.ref('adminAccounts').once('value', function(snapshot) {
      var admins = snapshot.val();
      if (admins.some(function(admin) { return admin.email === user.email; })) {
        // Admin logged in
        document.getElementById('adminView').style.display = 'block';
        document.getElementById('login').style.display = 'none';
  
        // Display all users data
        db.ref('userAccounts').once('value', function(snapshot) {
          var users = snapshot.val();
          var adminDataList = document.getElementById('adminData');
          adminDataList.innerHTML = '';
          Object.values(users).forEach(function(userData) {
            adminDataList.innerHTML += '<li>' + userData.email + '</li>';
          });
        });
      } else {
        // Regular user logged in
        document.getElementById('userView').style.display = 'block';
        document.getElementById('login').style.display = 'none';
  
        // Display user's own data
        document.getElementById('userData').innerText = user.email;
        document.getElementById('userData').innerText = user.email;
      }
    });
  }
  
  // Check authentication state on page load
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      showView(user);
    } else {
      // User is signed out
      document.getElementById('adminView').style.display = 'none';
      document.getElementById('userView').style.display = 'none';
      document.getElementById('login').style.display = 'block';
    }
  });
  

  function saveOptions() {
    var user = firebase.auth().currentUser;
    var userId = user.uid;
    var currentDate = new Date().toISOString().split('T')[0]; // Get current date (YYYY-MM-DD format)
    var selectedOptions = [];
    if (document.getElementById('option1').checked) {
        selectedOptions.push('Option 1');
    }
    if (document.getElementById('option2').checked) {
        selectedOptions.push('Option 2');
    }
    // Add more checkbox handling as needed

    if (selectedOptions.length === 0) {
        alert('Please select at least one option.');
        return;
    }

    // Check if data was already saved for the current date
    db.ref('userSavedData/' + userId + '/' + currentDate).once('value')
        .then(function(snapshot) {
            if (snapshot.exists()) {
                alert('Options already saved for today.');
            } else {
                // Save options to database
                db.ref('userSavedData/' + userId + '/' + currentDate).set(selectedOptions)
                    .then(function() {
                        alert('Options saved successfully.');
                        // Clear checkboxes
                        clearCheckboxes();
                    })
                    .catch(function(error) {
                        console.error('Error saving options: ', error);
                    });
            }
        })
        .catch(function(error) {
            console.error('Error checking saved options: ', error);
        });
}

function clearCheckboxes() {
    document.getElementById('option1').checked = false;
    document.getElementById('option2').checked = false;
    // Clear more checkboxes as needed
}

function showView(user) {
  db.ref('adminAccounts').once('value', function(snapshot) {
      var admins = snapshot.val();
      if (admins.some(function(admin) { return admin.email === user.email; })) {
          // Admin logged in
          document.getElementById('adminView').style.display = 'block';
          document.getElementById('login').style.display = 'none';

          // Display all added data from all users
          displayAllUserOptions();
      } else {
          // Regular user logged in
          document.getElementById('userView').style.display = 'block';
          document.getElementById('login').style.display = 'none';

          // Display user's own data
          document.getElementById('userData').innerText = user.email;
      }
  });
}

function displayAllUserOptions() {
  db.ref('userSavedData').once('value')
      .then(function(snapshot) {
          var allData = snapshot.val();
          var adminData = document.getElementById('adminData');
          adminData.innerHTML = '';
          for (var userId in allData) {
              if (allData.hasOwnProperty(userId)) {
                  var userData = allData[userId];
                  for (var date in userData) {
                      if (userData.hasOwnProperty(date)) {
                          adminData.innerHTML += '<h3>User ID: ' + userId + ', Date: ' + date + '</h3>';
                          adminData.innerHTML += '<ul>';
                          userData[date].forEach(function(option) {
                              adminData.innerHTML += '<li>' + option + '</li>';
                          });
                          adminData.innerHTML += '</ul>';
                      }
                  }
              }
          }
      })
      .catch(function(error) {
          console.error('Error displaying all user options: ', error);
      });
}
