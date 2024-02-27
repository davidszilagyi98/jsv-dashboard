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
  