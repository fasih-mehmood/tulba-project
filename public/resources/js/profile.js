$('.profile').click(function() {
	$(".dropdown").toggle(200,"swing");
})

var popup = document.querySelector('.popup-background');
var btn = document.querySelector('.edit');
var span = document.querySelector('.close');

function close() {
	popup.style.display = "none";
}

btn.onclick = function() {
	popup.style.display = "block";
};
span.onclick = function(){close();};

window.onclick = function(event) {
	if (event.target == popup) {
		close();
	}
};


function success() {
	Swal.fire({
		icon: 'success',
		title: 'Success',
		confirmButtonColor: 'green',
		text: 'Your profile has been updated successfully'
	})
};

function error(message) {
	Swal.fire({
		icon: 'error',
		title: 'Ops...',
		confirmButtonColor: 'red',
		text: message
	})
};

var loggedOut = true;

auth.onAuthStateChanged(user => {
	if(user) {
		db.collection('users').doc(currentEmail).onSnapshot(snapshot => {
			setupProfile(snapshot.data());
			setupEditForm(snapshot.data());
			load();
			loggedOut = false;
		})
	} else {
		load();
		if(loggedOut){
			Swal.fire({
				icon: 'error',
				title: 'Ops...',
				confirmButtonColor: 'red',
				text: 'Please login before accessing your profile.'
			}).then(() => {
				window.location.href = "../../index.html";
			});
		}
	}
})

// setup profile
const setupProfile = (data) => {
		let bio = '';
		let academics = '';	
		let skills = '';
		const biographics = document.querySelector('.biographics');
		const academic = document.querySelector('.academic');
		const skill = document.querySelector('.skills');
		bio = `
			<div class="row">
				<h2>Biographics</h2>
			</div>
			<div class="row">
				<h4>Full Name</h4>
				<p>${data.fullName}</p>
			</div>
			<div class="row">
				<h4>Father's Name</h4>
				<p>${data.fathersName}</p>
			</div>
			<div class="row">
				<h4>Email Address</h4>
				<p>${currentEmail}</p>
			</div>
			<div class="row">
				<h4>Phone Number</h4>
				<p>${data.phone}</p>
			</div>
			<div class="row">
				<h4>Gender</h4>
				<p>${data.gender}</p>
			</div>
			<div class="row">
				<h4>Date of Birth</h4>
				<p>${data.dob}</p>
			</div>
			<div class="row">
				<h4>Address</h4>
				<p>${data.address}</p>
			</div>
		`;
		if(data.isEmp){
			var separateExp = data.experiences.split(",");
			let sep = '';
			separateExp.forEach(exp => {
				sep += `<p>${exp}</p>`
			})
			academics = `
				<div class="row">
					<h2>Academic Info</h2>
				</div>
				<div class="row">
					<h4>Alma Mater University Name</h4>
					<p>${data.uniName}</p>
				</div>
				<div class="row">
					<h4>Graduation Year</h4>
					<p>${data.gradYear}</p>
				</div>
				<div class="row">
					<h4>Graduating Discipline</h4>
					<p>${data.major}</p>
				</div>
				<div class="row">
					<h4>Notable Experiences</h4>
					${sep}
				</div>
			`;
			skills = `
				<div class="row">
					<h2>Company Info</h2>
				</div>
				<div class="row">
					<h4>Company Name</h4>
					<p>${data.companyName}</p>
				</div>
				<div class="row">
					<h4>Year Established</h4>
					<p>${data.yearEstablished}</p>
				</div>
				<div class="row">
					<h4>Position</h4>
					<p>${data.position}</p>
				</div>
				<div class="row">
					<h4>Company Address</h4>
					<p>${data.companyAddress}</p>
				</div>
				<div class="row">
					<h4>Contact Email</h4>
					<p>${data.companyEmail}</p>
				</div>
				<div class="row">
					<h4>Total Employees</h4>
					<p>${data.employees}</p>
				</div>
			`;
		} else {
			academics = `
			<div class="row">
				<h2>Academic Info</h2>
			</div>
			<div class="row">
				<h4>University Name</h4>
				<p>${data.uniName}</p>
			</div>
			<div class="row">
				<h4>Discipline</h4>
				<p>${data.majSub}</p>
			</div>
			<div class="row">
				<h4>Degree Status</h4>
				<p>${data.degreeStat}</p>
			</div>
			<div class="row">
				<h4>Graduation Year</h4>
				<p>${data.gradYear}</p>
			</div>
			<div class="row">
				<h4>CGPA</h4>
				<p>${data.cgpa}</p>
			</div>
			<div class="row">
				<h4>School Email</h4>
				<p>${data.schoolEmail}</p>
			</div>
			<div class="row">
				<h4>linkedIn</h4>
				<p>${data.linkedIn}</p>
			</div>
			`;
			var separateSkills = data.skills.split(",");
			let sep = '';
			separateSkills.forEach(skill => {
				sep += `<li>${skill}</li>`
			})
			skills = `
				<div class="row">
					<h2>Skills</h2>
					<ul>
						${sep}
					</ul>
				</div>
			`;
		}
		biographics.innerHTML = bio;
		academic.innerHTML = academics;
		skill.innerHTML = skills;
};

// setup edit form
const setupEditForm = (data) => {
	let html = `
		<div class="row">
			<div class="col span-1-of-2">
				<div class="row">
					<label for="homeAddress">Home Address</label>
				</div>
				<div class="row">
					<input id="homeAddress" name="address" type="text" placeholder="Enter Home Address" value="${data.address}" required/>
				</div>
				<div class="row">
					<label for="phone">Phone Number</label>
				</div>
				<div class="row">
					<input id="phone" name="phone" type="tel" placeholder="Enter Phone Number" value="${data.phone}" required/>
				</div>
				<div class="row">
					<label for="linkedIn">linkedIn Profile</label>
				</div>
				<div class="row">
					<input id="linkedIn" type="text" name="linkedIn" placeholder="linkedIn Profile" value="${data.linkedIn}"/>
				</div>
	`;

	if(data.isEmp){
		html += `
				<div class="row">
					<label for="experiences">Experiences</label>
				</div>
				<div class="row">
					<textarea id="experiences" name="experiences" wrap="soft" placeholder="Enter experiences separated by commas" required>${data.experiences}</textarea>
				</div>
			</div>
			<div class="col span-1-of-2">
				<div class="row">
					<label for="companyName">Company Name</label>
				</div>
				<div class="row">
					<input id="companyName" name="companyName" type="text" placeholder="Enter Company Name" value="${data.companyName}" required/>
				</div>
				<div class="row">
					<label for="companyAddress">Company Address</label>
				</div>
				<div class="row">
					<input id="companyAddress" name="companyAddress" type="text" placeholder="Enter Company Address" value="${data.companyAddress}" required/>
				</div>
				<div class="row">
					<label for="position">Company Position</label>
				</div>
				<div class="row">
					<input id="position" name="position" type="text" placeholder="Enter Company Position" value="${data.position}" required/>
				</div>
				<div class="row">
					<label for="companyEmail">Company Email</label>
				</div>
				<div class="row">
					<input id="companyEmail" type="email" name="companyEmail" placeholder="Enter Company Email" value="${data.companyEmail}" required />
				</div>
				<div class="row">
					<label for="employees">Total Employees</label>
				</div>
				<div class="row">
					<input id="employees" name="employees" min='0' type="number" placeholder="Enter Number of Employees" value="${data.employees}" required/>
				</div>
			</div>
		</div>
		`;
	} else {
		html += `
				<div class="row">
					<label for="skills">Skills</label>
				</div>
				<div class="row">
					<textarea id="skills" name="skills" wrap="soft" placeholder="Enter skills separated by commas" required>${data.skills}</textarea>
				</div>
			</div>
			<div class="col span-1-of-2">
				<div class="row">
					<label for="uniName">University Name</label>
				</div>
				<div class="row">
					<input id="uniName" name="uniName" type="text" placeholder="University Name" value="${data.uniName}" required/>
				</div>
				<div class="row">
					<label for="uniEmail">School Email</label>
				</div>
				<div class="row">
				<input id="uniEmail" type="email" name="uniEmail" placeholder="University Email Address" value="${data.schoolEmail}" required/>
				</div>
				<div class="row">
					<label for="majSub">Discipline</label>
				</div>
				<div class="row">
					<input id="majSub" name="majSub" type="text" placeholder="Major" value="${data.majSub}" required/>
				</div>
				<div class="row">
					<label for="year">Graduation Year</label>
				</div>
				<div class="row">
					<input id="year" name="year" min="1930" max="2030" step="1" type="number" placeholder="Graduation Year" value="${data.gradYear}" required/>
				</div>
				<div class="row">
					<label for="cgpa">CGPA</label>
				</div>
				<div class="row">
					<input id="cgpa" name="cgpa" min="0" max="4" step="0.01" type="number" placeholder="Enter CGPA" value="${data.cgpa}" required/>
				</div>
			</div>
		</div>
		`;
	}
	html += `
		<div class="row row-submit">
			<button class="back-icon submit-btn" type="submit"><i class="ion-android-arrow-dropright-circle"></i></button>
		</div>
	`;
	editForm.innerHTML = html;
};

// edit form
const editForm = document.querySelector('#editProfile');
editForm.addEventListener('submit', (e) => {
	e.preventDefault();
	success();
	close();
	if(isEmp){
		db.collection('users').doc(currentEmail).update({
			address: editForm.address.value,
			phone: parseInt(editForm.phone.value,10),
			linkedIn: editForm.linkedIn.value,
			experiences: editForm.experiences.value,
			companyName: editForm.companyName.value,
			companyAddress: editForm.companyAddress.value,
			companyEmail: editForm.companyEmail.value,
			position: editForm.position.value,
			employees: parseInt(editForm.employees.value,10)
		}).then(() => {
			editForm.reset();
		}).catch(err => {
			error(err.message);
		})
	} else {
		db.collection('users').doc(currentEmail).update({
			address: editForm.address.value,
			phone: parseInt(editForm.phone.value,10),
			linkedIn: editForm.linkedIn.value,
			skills: editForm.skills.value,
			uniName: editForm.uniName.value,
			schoolEmail: editForm.uniEmail.value,
			majSub: editForm.majSub.value,
			gradYear: editForm.year.value,
			cgpa: parseFloat(editForm.cgpa.value)
		}).then(() => {
			editForm.reset();
		}).catch(err => {
			error(err.message);
		})
	}
});
