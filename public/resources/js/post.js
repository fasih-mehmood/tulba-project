auth.onAuthStateChanged(user => {
	if(user) {

	}
	else {
		Swal.fire({
			icon: 'error',
			title: 'Ops..',
			confirmButtonColor: 'red',
			text: 'Please login before accessing this page.'
		}).then(() => {
			window.location.href="../../index.html";
		});
	}
})

// post a job
const postJobForm = document.querySelector('#postJobForm');
postJobForm.addEventListener('submit', (e) => {
	e.preventDefault();
	if(isEmp){
		// store data of job
		db.collection('jobs').doc().set({
			jobTitle: postJobForm['title'].value,
			jobType: postJobForm['type'].value,
			website: postJobForm['website'].value,
			salary: parseFloat(postJobForm['salary'].value),
			jobLocation: postJobForm['location'].value,
			discipline: postJobForm['discipline'].value,
			workingHours: parseFloat(postJobForm['workingHours'].value),
			deadline: postJobForm['deadline'].value,
			cgpa: parseFloat(postJobForm['cgpa'].value),
			skills: postJobForm['skills'].value,
			jobEmail: currentEmail
		}).then(() => {
			return db.collection('users').doc(currentEmail).update({
				jobs: parseInt(myJobs+1)
			})
		}).catch(err => {
			error(err.message);
		});

		//postJobForm.reset();
		Swal.fire({
			icon: 'success',
			title: 'Registered Successfully',
			confirmButtonColor: 'green',
			text: 'Congratulations on successfully registering a job on Tulba'
		}).then(function(){
			window.location.href="jobs.html";
		})
	} else {
		Swal.fire({
		icon: 'error',
		title: 'Oops....',
		confirmButtonColor: '#000',
		text: 'Only employers can post jobs!'
	}).then(()=>{
		window.location.href="../student/home.html";
	});
	}
});
