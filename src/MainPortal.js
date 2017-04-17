import React from 'react';
import Dropzone from 'react-dropzone';
import request from 'superagent';

var config = {
    apiKey: "AIzaSyC71JCKeX0y6ohdWQuzXaoYQkP1RwirXAc",
    authDomain: "tripplanner-5f8ce.firebaseapp.com",
    databaseURL: "https://tripplanner-5f8ce.firebaseio.com",
    projectId: "tripplanner-5f8ce",
    storageBucket: "tripplanner-5f8ce.appspot.com",
    messagingSenderId: "780822703710"
  };
  firebase.initializeApp(config);


const AddTripForm = (props) => {
	return (
		<div className="overlay" ref={props.reference}>
			<form className="addTripForm"  onSubmit={props.add} >
				<i className="fa fa-times-circle" aria-hidden="true" onClick={props.exit}></i>
				<label htmlFor="">Trip</label>
				<input type="text" name="tripName" onChange={props.handleChange} placeholder="ie: 'Vancouver, BC'"/>
				<label htmlFor="">Budget</label>
				<input type="number" name="tripBudget" onChange={props.handleChange} placeholder="Total Budget..."/>
				<textarea name="tripNotes" value={props.thisValue} onChange={props.handleChange} cols="20" rows="2" placeholder="enter a message..."></textarea>
				<button>Submit</button>
			</form>
		</div>
	)
}

const CLOUDINARY_UPLOAD_PRESET = 'uy9xwo0f';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/diystpeqh/upload';

export default class MainPortal extends React.Component {
	constructor() {
		super();
		this.state = {
			//for trips screen
			tripsArray: [],
			tripName: '',
			tripBudget: '',
			tripCurrency: '',
			tripNotes: '',
			tripShow: '',
			tripID: '',
			expenseShow: '',
			theTripPortal: true,
			tripIndex: '',
			expensesArray: [{
				expenseName: '',
				expenseAmount: '',
				expenseType: ''
			}],
			expenseName: '',
			expenseAmount: '',
			expenseType: 'food',
			uploadedFileCloudinaryUrl: ''
		}
		this.handleChange = this.handleChange.bind(this);
		this.showTravelList = this.showTravelList.bind(this);
		this.exitForm = this.exitForm.bind(this);
		this.goBack = this.goBack.bind(this);
		this.addTrip = this.addTrip.bind(this);
		this.removeTrip = this.removeTrip.bind(this);
		this.showExpenseForm = this.showExpenseForm.bind(this);
		this.exitExpenseForm = this.exitExpenseForm.bind(this);
		this.addAnExpense = this.addAnExpense.bind(this);
		this.removeExpense = this.removeExpense.bind(this);
		this.onImageDrop = this.onImageDrop.bind(this);
	}
	componentDidMount() {
		
		
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				const tripID = this.state.tripID;
				const userID = firebase.auth().currentUser.uid;
				const tripIndex = this.state.tripIndex;

				firebase.database().ref(`users/${user.uid}/trips`).on('value', (res) => {
					// console.log(res.val());
					const userData = res.val();
					let tripsArray = [];
					for(let key in userData) {
						userData[key].key = key;
						tripsArray.push(userData[key]);
					}
					tripsArray = tripsArray.map((trip) => {
						const expenseArray = [];
						for(let key in trip.expenses) {
							trip.expenses[key].key = key;
							expenseArray.push(trip.expenses[key]);
						}
						trip.expenses = expenseArray;
						return trip
					})
					this.setState({
						tripsArray: tripsArray
					})
					// console.log(dataArray);
				})
				

				
			}
		})
		
	}
	onImageDrop(files) {
		this.setState({
			uploadedFile: files[0]
		});

		this.handleImageUpload(files[0]);
	}
	handleImageUpload(file) {
		let upload = request.post(CLOUDINARY_UPLOAD_URL)
	                        .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
	                        .field('file', file);
	    upload.end((err, response) => {
	      if (err) {
	        console.error(err);
	      }

	      if (response.body.secure_url !== '') {
	        this.setState({
	          uploadedFileCloudinaryUrl: response.body.secure_url
	        });
	      }
	    });
	}

	//to capture the input text fields
	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		})
	}
	//to show an overlay form for trips portal
	showTravelList() {
		this.setState({
			tripShow: true
		})
	}
	//to exit and overlay form for trips portal
	exitForm() {
		this.setState({
			tripShow: false
		})
	}
	//to go back to the main trip portal
	goBack() {
		this.portalHeader.classList.toggle('portalHeaderSmaller');
		this.portalIntro.classList.toggle('hide');
		this.setState({
			theTripPortal: true,
			tripIndex: ''
		})
	}
	//to add a trip to the list
	addTrip(e) {
		e.preventDefault();
		// const tripDuplicate = this.state.tripsArray.slice();
		const tripDetails = {
			tripName: this.state.tripName,
			tripBudget: this.state.tripBudget,
			tripCurrency: this.state.tripCurrency,
			tripNotes: this.state.tripNotes
		}
		const userID = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userID}/trips`);
		dbRef.push(tripDetails);


		this.setState({
			tripShow: false,
			tripName: '',
			tripBudget: '',
			tripNotes: ''
		})

	}
	//to remove a trip from the list
	removeTrip(trip, i) {
		const userID = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userID}/trips/${trip.key}`);
		dbRef.remove();
	}
	//to enter the individual trip
	enterTrip(trip, i) {
		const trippy = this.state.tripsArray[i];
		this.portalHeader.classList.toggle('portalHeaderSmaller');
		this.portalIntro.classList.toggle('hide');
		this.setState({
			theTripPortal: false,
			tripIndex: i,
			tripID: trip.key
		})
	}
	addAnExpense(e) {
		e.preventDefault();
		
		const expenseDetails = {
			expenseName: this.state.expenseName,
			expenseAmount: this.state.expenseAmount,
			expenseType: this.state.expenseType
		}
		const tripID = this.state.tripID;
		const userID = firebase.auth().currentUser.uid;

		const dbRef = firebase.database().ref(`users/${userID}/trips/${tripID}/expenses`);
		dbRef.push(expenseDetails);

		this.setState({
			expenseShow: false
		})
	}


	//to show the add an expense form
	showExpenseForm() {
		// console.log('guccii');
		this.setState({
			expenseShow: true
		})
	}
	//to exit the expense form
	exitExpenseForm() {
		this.setState({
			expenseShow: false
		})
	}
	
	removeExpense(expense, i) {
		console.log('trip', expense);
		console.log('i', i);
		const tripID = this.state.tripID;
		const userID = firebase.auth().currentUser.uid;
		const dbRef = firebase.database().ref(`users/${userID}/trips/${tripID}/expenses/${expense.key}`);
		dbRef.remove();

		// const tripIndex = this.state.tripIndex;
		// const tripDuplicate = this.state.tripsArray.slice();
		// const indexToDelete = i;
		// tripDuplicate[tripIndex].expenses.splice(i, 1);
		// this.setState({
		// 	tripsArray: tripDuplicate
		// })
	}
	render() {
		//for the user to upload an image
		let dropZone = '';
		if (this.state.uploadedFileCloudinaryUrl === '') {
			dropZone = (
				<div>
					<p>Click the photo to upload a photo</p>
					<Dropzone
						className="dropZone"
						multiple={false}
						accept="image/*"
						onDrop={this.onImageDrop.bind(this)}>
						<img src="../assets/img/corgi.jpg" alt=""/>
					</Dropzone>
				</div>
			)
		} else {
			dropZone = (
				<div>
					<Dropzone
						className="dropZone"
						multiple={false}
						accept="image/*"
						onDrop={this.onImageDrop.bind(this)}>
						<img src={this.state.uploadedFileCloudinaryUrl} alt=""/>
					</Dropzone>
				</div>
			)
		}



		//when user clicks add a trip... on click, it sets tripShow state to true, and when it's true, we show tripForm
		//ADD A TRIP FORM
		let tripForm = '';
		if (this.state.tripShow == true) {
			tripForm = (
				<AddTripForm appear={this.showTravelList} handleChange={this.handleChange} add={this.addTrip} thisValue={this.state.value} reference={ref => this.showTripForm = ref} exit={this.exitForm} />
			)
		}



		//the add an expense form
		let expenseForm = '';
		if (this.state.expenseShow == true) {
			expenseForm = (
				<div className="overlay">
					<form className="secondform" onSubmit={this.addAnExpense}>
						<i className="fa fa-times-circle" aria-hidden="true" onClick={this.exitExpenseForm}></i>
						<label htmlFor="expenseAmount">Amount</label>
						<input type="number" name="expenseAmount" placeholder="Amount" onChange={this.handleChange}/>
						<label htmlFor="expenseName">Name</label>
						<input type="text" name="expenseName" placeholder="Title" onChange={this.handleChange}/>
						<label htmlFor="expenseType">Type</label>
						<select name="expenseType" value={this.state.expenseType} onChange={this.handleChange}>
							<option value="food">Food</option>
							<option value="accommodation">Accomodation</option>
							<option value="fun">Fun</option>
						</select>
						<button>Submit it</button>
					</form>
				</div>
			)
		}



		let theTripPortal = '';
		//main trip list portal
		if (this.state.theTripPortal == true) {
			theTripPortal = (
				<section className="tripsSection wrapper">
					<article className="tripsContainer">
						<div className="tripsHeader">
							<h2>Trips</h2>
							<button className="btn" onClick={this.showTravelList}>Add a trip</button>
						</div>
						{this.state.tripsArray.map((trip, i) => {
							return (
								<div className="tripList">
									<div className="eachTrip">
										<div className="eachTitle">
											<h3>{trip.tripName}</h3>
											<p>20000</p>
											<p>20000</p>
										</div>
										<div className="eachNotes">
											<p>{trip.tripNotes}</p>
										</div>
									</div>
									<div className="eachAction">
										<i className="fa fa-sign-in" aria-hidden="true" onClick={() => this.enterTrip(trip, i)}></i>
										<i className="fa fa-trash-o" aria-hidden="true" onClick={() => this.removeTrip(trip, i)}></i>
									</div>
								</div>
							)
						})}
					</article>
				</section>
			)
		}



		//individual trip portal
		if (this.state.theTripPortal == false) {
			theTripPortal = (
				<section className="tripsSection expenseArea wrapper">
				<aside>
					{dropZone}
					<p><span className="text-bold">Total Budget:</span> ${this.state.tripsArray[this.state.tripIndex].tripBudget}</p>
					<p><span className="text-bold">Remaining Budget:</span> ${this.state.tripsArray[this.state.tripIndex].tripBudgetLeft}</p>
					<p><span className="text-bold">Trip Notes:</span> {this.state.tripsArray[this.state.tripIndex].tripNotes}</p>
				</aside>
				<article className="innerPortalMain">
					<div className="tripsHeader">
						<i className="fa fa-arrow-circle-o-left" aria-hidden="true" onClick={this.goBack}></i>
						<h2>Expenses</h2>
						<i className="fa fa-plus-circle" aria-hidden="true" onClick={this.showExpenseForm}></i>
					</div>
						{
							this.state.tripsArray[this.state.tripIndex].expenses.map((expense, i) => {
							let typeOfIcon = '';
							if (expense.expenseType === 'accommodation') {
								typeOfIcon = (
										<img src="../assets/img/rentIcon.svg" alt="" className="expenseIcon"/>
									)
							}
							if (expense.expenseType === 'food') {
								typeOfIcon = (
										<img src="../assets/img/foodIcon.svg" alt="" className="expenseIcon"/>
									)
							}
							if (expense.expenseType === 'fun') {
								typeOfIcon = (
										<img src="../assets/img/funIcon.svg" alt="" className="expenseIcon"/>
									)
							}
							return (
								<div className="tripList">
									<div className="expenseTypeDiv">
										{typeOfIcon}
									</div>
									<div className="eachExpense">
										<h3>{expense.expenseName}</h3>
										<p>{expense.expenseAmount}</p>
									</div>
									<div className="expenseAction">
										<i className="fa fa-trash-o" aria-hidden="true" onClick={() => this.removeExpense(expense, i)}></i>
									</div>
								</div>
							)
							})
						}
				</article>
				</section>
			)
		}



		//header details
		let headerDeets = '';
		if (this.state.tripsArray[this.state.tripIndex] !== undefined) {
			headerDeets = (
				<div className="headerBottom wrapper">
					<h3>{this.state.tripsArray[this.state.tripIndex].tripName}</h3>
					<h3><p>Remaining Budget:</p> {this.state.tripsArray[this.state.tripIndex].tripBudgetLeft}</h3>
				</div>	
				)
		}


		return (
			<div>
				{tripForm}
				{expenseForm}
				<header className="portalHeader" ref={ref => this.portalHeader = ref}>
					<div className="portalIntro" ref={ref => this.portalIntro =ref}>
						<h1>Welcome</h1>
						<p>1. To get started, click Add A Trip</p>
						<p>2. Enter in the trip name, trip budget, and any notes you have</p>
						<p>3. Go inside that trip and keep track of your expenses</p>
					</div>
					{headerDeets}
				</header>
				
				{theTripPortal}
					
			</div>
				
		)
	}
}