const jobsContainer = document.querySelector('.jobs-container');
const noJobs = document.querySelector('.noJobs');
const sectionJobs = document.querySelector('.section-jobs');
const sectionDetails = document.querySelector('.section-details');
const back = document.querySelectorAll('.back-icon');
const back1 = back[0];
var jobEmail;
var jobTitle;
var dataId;
var empPage;
if (document.body.getAttribute('class') == 'emp-body') {
	empPage = true;
} else {
	empPage = false;
};

$('.profile').click(function() {
	$(".dropdown").toggle(200,"swing");
});

$(".js--btn-emp").click(function(){
	confirm();
});

$('.js--btn-std').click(function(){
	success();
});

let jobs = $('.jobs-container .row:nth-child(n+3)');

if(jobs.length < 6) {
	$('.view')[0].style.display = "none";
	$('#search_bar')[0].style.display = "none";
};

$('.more').click(function() {
	$('.more')[0].style.display = "none";
	$('.less')[0].style.display = "block";
	for (let x = 5; x < jobs.length; x++)
		jobs[x].style.display = "block";
});

$('.less').click(function() {
	$('.less')[0].style.display = "none";
	$('.more')[0].style.display = "block";
	for (let x = 5; x < jobs.length; x++)
		jobs[x].style.display = "none";
});

function success() {
	Swal.fire({
		icon: 'success',
		title: 'Applied Successfully',
		confirmButtonColor: 'green',
		text: 'Congratulations on successfully applying on Tulba'
	}).then(function(){
		hideDetails();
	})
};

function confirm() {
	if(currentEmail === jobEmail) {
		Swal.fire({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes, delete it!'
		}).then((result) => {
			if (result.value) {
				deleteJob(dataId);
			}
		})
	} else {
		auth.signOut();
		Swal.fire({
			icon: 'warning',
			title: 'Warning',
			confirmButtonColor: 'red',
			text: "You don't have the authority to perform this operation. You have been logged out as a warning. Repeating this action will result in a ban!"
		}).then(() => {
			window.location.href = '../../index.html';
		})
	}
};

function error() {
	Swal.fire({
		icon: 'error',
		title: 'Oops....',
		confirmButtonColor: '#000',
		text: 'Please make sure all fields are filled correctly!'
	});
};

const searchBar = document.forms['search_bar'].querySelector('input');
searchBar.addEventListener('keyup',function(e){
	$('.view')[0].style.display = "none";
	const term = e.target.value.toLowerCase();
	Array.from(jobs).forEach(function(job){
		const title = job.firstElementChild.nextElementSibling.innerText;
		if(title.toLowerCase().indexOf(term) != -1){
			job.style.display = "block";
		} else {
			job.style.display = "none";
		}
	})
});

//setup jobs

var loggedOut = true;

auth.onAuthStateChanged(user => {
	if(user) {
		var dbb;
		loggedOut = false;
		if (empPage || isEmp) { 
			dbb = db.collection('jobs').where('jobEmail','==',currentEmail).orderBy('jobTitle');
		} else {
			dbb = db.collection('jobs').orderBy('jobTitle');
		}
		dbb.onSnapshot(snapshot => {
			let changes = snapshot.docChanges();
			changes.forEach(change => {
				if(change.type == 'added') {
					noJobs.style.display = 'none';
					setupJobOffers(change.doc);jobs = $('.jobs-container .row:nth-child(n+2)');
				} else if (change.type == 'removed') {
					let div = jobsContainer.querySelector('[data-id="' + change.doc.id + '"]');
					jobsContainer.removeChild(div);
				};
			});
		})
	} else {
		if (loggedOut) {
			load();
			Swal.fire({
				icon: 'error',
				title: 'Ops..',
				confirmButtonColor: 'red',
				text: 'Please login before accessing this page.'
			}).then(() => {
				window.location.href="../../index.html";
			});
		}
	}
	load();
});

// Delete jobs
const deleteJob = (job) => {
	db.collection('users').doc(currentEmail).update({
		jobs: parseInt(myJobs-1)
	})
	db.collection('jobs').doc(job).delete();
	Swal.fire(
	'Deleted!',
	'Your Job has been deleted.',
	'success'
	).then(function(){
		hideDetails();
	})
};

// setup Jobs
const setupJobOffers = (doc) => {
	let div = document.createElement('div');
	let img = document.createElement('img');
	div.appendChild(img);
	let h3 = document.createElement('h3');
	div.appendChild(h3);
	let a = document.createElement('a');
	div.appendChild(a);

	div.setAttribute('data-id', doc.id);
	div.setAttribute('class','row');
	img.setAttribute('alt','Logo Image');
	img.setAttribute('src','');
	h3.setAttribute('class','job-title');
	h3.textContent = doc.data().jobTitle;
	a.setAttribute('class','btn btn-full');
	a.setAttribute('href','#');
	a.textContent = 'Details';
	storageRef.child('logos/'+doc.data().jobEmail+'logo').getDownloadURL().then(function(url) {
		img.src = url;
	}).catch(err => {
		console.log(err.message);
	});
	jobsContainer.appendChild(div);
	a.addEventListener('click', (e) => {
		e.stopPropagation();
		dataId = doc.id;
		setupJob(doc.data(), img.src);
	});
};

const setupJob = (data,logo) => {
	var separateSkills = data.skills.split(",");
	jobTitle = data.jobTitle;
	jobEmail = data.jobEmail;
	let sep = '';
	separateSkills.forEach(skill => {
		sep += `<li>${skill}</li>`
	})
	let html = `
	<div class="row job-container">
		<div class="col span-1-of-2">
			<div class="row">
				<h2>${data.jobTitle}</h2>
			</div>
			<div class="row">
				<h3>Academic Requirements</h3>
				<ul>
					<li>CGPA: ${data.cgpa}</li>
					<li>Discipline: ${data.discipline}</li>
				</ul>
			</div>
			<div class="row">
				<h3>Required Skills</h3>
				<ul>${sep}</ul>
			</div>
			<div class="row">
				<h3>Job Details</h3>
				<ul>
					<li>Job Type: ${data.jobType}</li>
					<li>Working Hours: ${data.workingHours}</li>
					<li>Deadline: ${data.deadline}</li>
				</ul>
			</div>
		</div>
		<div class="col span-1-of-2">
			<div class="row">
				<img class="job-logo" alt="Logo Image" src="${logo}">
			</div>
			<div class="row">
				<h3>Location</h3>
			</div>
			<div class="row">
				<p class="address">${data.jobLocation}</p>
				</br>
				<p class="salary">Salary: $${data.salary}</p>
			</div>
			<div class="row">`;
	if(isEmp) {
		jobEmail = data.jobEmail;
		html += `<a href="#" class="btn btn-full js--btn-std" onclick="confirm()">Delete</a>`;
	} else {
		html += `<a href="#" class="btn btn-full js--btn-std" value="Send Email" onclick="sendEmail()">Apply</a>
		<form method="post">
		<input type="button" class="btn btn-full js--btn-std" value="Apply" onclick="sendEmail()"/>
		</form>`
	}
	html += `</div>
		</div>
	</div>
	<a class="back-icon hidePop" href="#" onclick="hideDetails();"><i class="ion-android-arrow-dropleft-circle"></i></a>
	`;
	sectionDetails.innerHTML = html;
	showDetails();
};

function showDetails () {
	$(sectionDetails).fadeIn('slow');
	$(sectionJobs).fadeOut('fast');
	$(back1).fadeOut('fast');
};

function hideDetails () {
	$(sectionDetails).fadeOut('fast');
	$(sectionJobs).fadeIn('slow');
	$(back1).fadeIn('slow');
};

var emailBody = "Yo, nigga, I'm applying for the job. you better give it up.";

function sendEmail() {
	Email.send({
	Host: "smtp.gmail.com",
	Username : "fasih.mehmood2@gmail.com",
	Password : "Fasihmnw132",
	To : "fasih.mehmood1@gmail.com",
	From : "Tulba",
	Subject : "Application for ",
	Body : "Send",
	}).then(
		success()
	);
};
