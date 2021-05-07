const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedOutBtns = document.querySelectorAll('.logged-out-btn');
const loggedInLinks = document.querySelectorAll('.logged-in');
const loggedInBtns = document.querySelectorAll('.logged-in-btn');
var isEmp;
var myJobs;
var currentEmail;

// make auth and firestore references
const auth = firebase.auth();
const db = firebase.firestore();
const storageRef = firebase.storage().ref();

function load() {
	// Animate loader off screen
	$(".se-pre-con").fadeOut("slow");
	}


$(document).ready(function () {
})

// listen for auth status changes
auth.onAuthStateChanged(user => {
	if (user) {
		currentEmail = user.email;
		storageRef.child('users/'+currentEmail).getDownloadURL().then(function(url) {
			var img = document.querySelector('.profile');
			img.src = url;
		}).catch(err => {
			console.log(err.message);
		});
		db.collection('users').doc(currentEmail).get().then(doc => {
			isEmp = doc.data().isEmp;
			if(isEmp) {
				myJobs = parseInt(doc.data().jobs,10);
			}
			if(isEmp && document.URL.includes('student')) {
				var loc = document.URL.replace('student','employer');
				window.location.href = loc;
			} else if (!isEmp && document.URL.includes('employer')) {
				var loc = document.URL.replace('employer','student');
				window.location.href = loc;
		}
		});
		// toggle user UI elements
		loggedInLinks.forEach(item => item.style.display = 'block');
		loggedInBtns.forEach(item => item.style.display = "inline-block");
		loggedOutLinks.forEach(item => item.style.display = 'none');
		loggedOutBtns.forEach(item => item.style.display = "none");
	} else {
		currentEmail = undefined;
		// toggle user elements
		loggedInLinks.forEach(item => item.style.display = 'none');
		loggedInBtns.forEach(item => item.style.display = "none");
		loggedOutLinks.forEach(item => item.style.display = 'block');
		loggedOutBtns.forEach(item => item.style.display = "inline-block");
	}
});

// logout
function logout(relocation) {
	Swal.fire({
		icon: 'success',
		title: 'Success',
		confirmButtonColor: 'greenyellow',
		text: 'Logged out successfully!'
	}).then(() => {
		auth.signOut();
		window.location.href = relocation;
	})
};
