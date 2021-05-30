'use strict';

// Signs-in Line Notify Register.
function signIn() {
    // Sign in Firebase using popup auth and Google as the identity provider.
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
}

// Signs-out of Line Notify Register.
function signOut() {
    // Sign out of Firebase.
    firebase.auth().signOut();
}

// Initiate firebase auth.
function initFirebaseAuth() {
    // Listen to auth state changes.
    firebase.auth().onAuthStateChanged(authStateObserver);
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
    if (user) { // User is signed in!
        // Get the signed-in user's profile pic and name.
        var profilePicUrl = getProfilePicUrl();
        var userName = getUserName();

        // Set the user's profile pic and name.
        // userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
        userPicElement.src = addSizeToGoogleProfilePic(profilePicUrl)
        userNameElement.textContent = userName;

        // Show user's profile and sign-out button.
        userNameElement.removeAttribute('hidden');
        userPicElement.removeAttribute('hidden');
        signOutButtonElement.removeAttribute('hidden');

        // Hide sign-in button.
        signInButtonElement.setAttribute('hidden', 'true');

        buildRegistryTable();

    } else { // User is signed out!
        // Hide user's profile and sign-out button.
        userPicElement.setAttribute('hidden', 'true');
        userNameElement.setAttribute('hidden', 'true');
        signOutButtonElement.setAttribute('hidden', 'true');

        // Show sign-in button.
        signInButtonElement.removeAttribute('hidden');
    }
}


// Google auth---------------------------
// authStateObserver
function getProfilePicUrl() {
    return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}


// Returns the signed-in user's display name.
function getUserName() {
    return firebase.auth().currentUser.displayName;
}

function getUserUID() {
    return firebase.auth().currentUser.uid;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
    return !!firebase.auth().currentUser;
}


// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
    if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
        return url + '?sz=150';
    }
    return url;
}


// ---------------------------

function buildRegistryTable() {
    if (isUserSignedIn()) {
        var index = 1;
        var query = firebase.firestore().collection('LINE_Notify');
        query.get().then((doc) => {
            var all_notify = doc.docs;
            all_notify.forEach((device) => {
                device.data()['access_token'].forEach((notify) => {

                    if (notify.user == getUserUID()) {
                        // console.log('Add ' + notify.token);
                        var row = registryTableElement.insertRow(-1);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                        var cell4 = row.insertCell(3);

                        var ActiveHTML = '<a class="btn btn-danger" href="https://notify-bot.line.me/my/" target="_blank" >Delete</a>';

                        // Add some text to the new cells:
                        cell1.innerHTML = index;
                        cell2.innerHTML = device.id;
                        cell3.innerHTML = notify.token.slice(0, 10);
                        cell4.innerHTML = ActiveHTML;
                        index += 1;
                    }

                });
            });
        });
    }
}


function register() {
    if (isUserSignedIn()) {
        if (piIdInputElement.value != "") {
            var URL = 'https://notify-bot.line.me/oauth/authorize?';
            URL += 'response_type=code';
            URL += '&client_id=Rlf9IfJPd47g67YLhH84R9';
            URL += '&redirect_uri=https://us-central1-ntut-mask-project-312013.cloudfunctions.net/NTUT-Mask-LineNotify-Register/register';
            URL += '&scope=notify';
            URL += '&state=' + piIdInputElement.value + '_' + getUserUID();
            URL += '&response_mode=form_post';
            // console.log(URL);
            window.location.href = URL;
            return false;
        } else {
            alert('Please input pi-id');
        }
    } else {
        alert('You must sign-in first');
    }
}


function checkSetup() {
    if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
        window.alert('You have not configured and imported the Firebase SDK. ' +
            'Make sure you go through the codelab setup instructions and make ' +
            'sure you are running the codelab using `firebase serve`');
    }
}

checkSetup();

var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');

var registerFormElement = document.getElementById('register-form');
var registerButtonElement = document.getElementById('register-btn');
var piIdInputElement = document.getElementById('pi-id');

var registryTableElement = document.getElementById('registry-table');

// Saves message on form submit.
signInButtonElement.addEventListener('click', signIn);
signOutButtonElement.addEventListener('click', signOut);

registerFormElement.addEventListener('submit', register);

// initialize Firebase
initFirebaseAuth();

