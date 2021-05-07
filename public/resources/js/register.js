var profile;
var logo;
var empPage;

if (document.body.getAttribute('class') == "emp-body") {
	empPage = true;
} else {
	empPage = false;
}

function error(message) {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        confirmButtonColor: '#000',
        text: message
    });
}

$("#js--profile-container").click(function(e) {
    $("#imageUpload").click();
});

function fasterPreview( uploader ) {
    if ( uploader.files && uploader.files[0] ){
        $('#js--profileImage').attr('src', 
            window.URL.createObjectURL(uploader.files[0]) );
    }
    profile = uploader.files[0];
}

$("#imageUpload").change(function(){
    fasterPreview( this );
});

$("#js--logo-container").click(function(e) {
    $("#logoUpload").click();
});

function fasterPreview2( uploader ) {
    if ( uploader.files && uploader.files[0] ){
        $('#js--logoImage').attr('src', 
            window.URL.createObjectURL(uploader.files[0]) );
            logo = uploader.files[0];
    }
}

$("#logoUpload").change(function(){
    fasterPreview2( this );
});

// signup
const signupForm = document.querySelector('#signupForm');
signupForm.addEventListener('submit', (e) => {
	e.preventDefault();
	// get user info
	const email = signupForm['emailAddress'].value;
	const password = signupForm['password'].value;
	// sign up the user
	auth.createUserWithEmailAndPassword(email, password).then(cred => {
		// store pic
		var storage = storageRef.child('users/'+email);
		storage.put(profile);
		if(empPage){
			storage = storageRef.child('logos/'+email+'logo');
			storage.put(logo);
			// store data for employer
			return db.collection('users').doc(email).set({
				fullName: signupForm['fullName'].value,
				fathersName: signupForm['fathersName'].value,
				address: signupForm['homeAddress'].value,
				dob: signupForm['dateOfBirth'].value,
				gender: signupForm['gender'].value,
				phone: parseInt(signupForm['phone'].value,10),
				uniName: signupForm['institute'].value,
				major: signupForm['discipline'].value,
				gradYear: parseInt(signupForm['year'].value,10),
				experiences: signupForm['experiences'].value,
				companyName: signupForm['companyName'].value,
				companyAddress: signupForm['companyAddress'].value,
				companyEmail: signupForm['companyEmail'].value,
				yearEstablished: parseInt(signupForm['yearEstablished'].value,10),
				position: signupForm['position'].value,
				employees: parseInt(signupForm['employees'].value,10),
				isEmp: true,
				jobs: 0
			});
		} else {
			// store data for student
			return db.collection('users').doc(email).set({
				fullName: signupForm['fullName'].value,
				fathersName: signupForm['fatherName'].value,
				address: signupForm['homeAddress'].value,
				dob: signupForm['dateOfBirth'].value,
				gender: signupForm['gender'].value,
				phone: parseInt(signupForm['phone'].value,10),
				schoolEmail: signupForm['uniEmail'].value,
				linkedIn: signupForm['linkedIn'].value,
				uniName: signupForm['uniName'].value,
				majSub: signupForm['majSub'].value,
				degreeStat: signupForm['degreeStat'].value,
				gradYear: parseInt(signupForm['year'].value,10),
				cgpa: parseFloat(signupForm['cgpa'].value),
				skills: signupForm['skills'].value,
				isEmp: false
			});
		};
	}).then(()=>{
		document.forms[0].style.display = "none";
		Swal.fire({
			icon: 'success',
			title: 'Registered Successfully',
			confirmButtonColor: 'green',
			text: 'Congratulations on successfully registering on Tulba'
		}).then(function(){
			window.location.href="profile.html"
		})
	}).catch(err => {
		error(err.message);
	})
});
