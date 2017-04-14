import React from 'react';
import { ajax } from 'jquery';
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
				<input type="text" name="tripName" onChange={props.handleChange} placeholder="Trip"/>
				<label htmlFor="">Budget</label>
				<input type="number" name="tripBudget" onChange={props.handleChange} placeholder="budget"/>
				<textarea name="tripNotes" value={props.thisValue} onChange={props.handleChange} cols="20" rows="2"></textarea>
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
			expenseShow: '',
			theTripPortal: true,
			tripIndex: '',
			expensesArray: [],
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
		this.portalHeader.classList.toggle('smaller');
		this.ctaBanner.classList.toggle('hide');
		this.setState({
			theTripPortal: true,
			tripIndex: ''
		})
	}
	//to add a trip to the list
	addTrip(e) {
		e.preventDefault();
		const tripDuplicate = this.state.tripsArray.slice();
		const tripDetails = {
			tripName: this.state.tripName,
			tripBudget: this.state.tripBudget,
			tripCurrency: this.state.tripCurrency,
			tripNotes: this.state.tripNotes,
			expensesArray: []
		}
		tripDuplicate.push(tripDetails);
		this.setState({
			tripsArray: tripDuplicate,
			tripName: '',
			tripBudget: '',
			tripCurrency: '',
			tripNotes: '',
			tripShow: false
		})
		console.log('nicca', this.state.tripsArray)
	}
	//to remove a trip from the list
	removeTrip(i) {
		const tripDuplicate = this.state.tripsArray.slice();
		const indexToDelete = i;
		tripDuplicate.splice(i, 1);
		this.setState({
			tripsArray: tripDuplicate
		})
	}
	//to enter the individual trip
	enterTrip(trip, i) {
		const trippy = this.state.tripsArray[i];
		console.log('wheoooooo', trippy);
		this.portalHeader.classList.toggle('smaller');
		this.ctaBanner.classList.toggle('hide');
		this.setState({
			theTripPortal: false,
			tripIndex: i
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
	addAnExpense(e) {
		e.preventDefault();
		const tripIndex = this.state.tripIndex;
		const expenseDetails = {
			expenseName: this.state.expenseName,
			expenseAmount: this.state.expenseAmount,
			expenseType: this.state.expenseType
		}
		const tripsArrayDuplicate = this.state.tripsArray.slice();
		tripsArrayDuplicate[tripIndex].expensesArray.push(expenseDetails)
		tripsArrayDuplicate[tripIndex].tripBudgetLeft = tripsArrayDuplicate[tripIndex].tripBudget - this.state.expenseAmount;
		this.setState({
			tripsArray: tripsArrayDuplicate,
			expenseShow: false,
			expenseName: '',
			expenseAmount: '',
			expenseType: 'food'
		})
		

	}
	removeExpense(i) {
		const tripIndex = this.state.tripIndex;
		const expensesArrayDuplicate = this.state.tripsArray.slice();
		const indexToDelete = i;
		expensesArrayDuplicate[tripIndex].expensesArray.splice(i, 1);
		this.setState({
			tripsArray: expensesArrayDuplicate
		})
	}
	render() {
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
						<img src="../assets/img/upload.svg" alt=""/>
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
							<button to="/">Back to home</button>
						</div>
						{this.state.tripsArray.map((trip, i) => {
							return (
								<div className="tripList">
									<div className="eachTrip">
										<h3>{trip.tripName}</h3>
										<p>{trip.tripCurrency}</p>
										<p>{trip.tripBudget}</p>
										<p>{trip.tripBudgetLeft}</p>
										<p className="notes">{trip.tripNotes}</p>
									</div>
									<div className="eachAction">
										<i className="fa fa-sign-in" aria-hidden="true" onClick={() => this.enterTrip(trip, i)}></i>
										<i className="fa fa-trash-o" aria-hidden="true" onClick={() => this.removeTrip(i)}></i>
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
				<section className="tripsSection wrapper">
				<aside>
					{dropZone}
					<p>Total Budget: {this.state.tripsArray[this.state.tripIndex].tripBudget}</p>
					<p>Remaining Budget: {this.state.tripsArray[this.state.tripIndex].tripBudgetLeft}</p>
					<p>Trip Notes: {this.state.tripsArray[this.state.tripIndex].tripNotes}</p>
				</aside>
				<article>
					<div className="tripsHeader">
						<i className="fa fa-arrow-circle-o-left" aria-hidden="true" onClick={this.goBack}></i>
						<h2>Expenses</h2>
						<i className="fa fa-plus-circle" aria-hidden="true" onClick={this.showExpenseForm}></i>
					</div>
						{this.state.tripsArray[this.state.tripIndex].expensesArray.map((expense, i) => {
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
								<div className="eachTrip">
									<h3>{expense.expenseName}</h3>
									<p>{expense.expenseAmount}</p>
								</div>
								<div className="eachAction">
									<i className="fa fa-trash-o" aria-hidden="true" onClick={() => this.removeExpense(i)}></i>
								</div>
							</div>
						)

					})}
				</article>
				</section>
			)
		}
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
				
				<div className="cta" ref={ref => this.ctaBanner = ref}>Hello There! Welcome to the trip planner</div>
				
				{theTripPortal}
					
			</div>
				
		)
	}
}