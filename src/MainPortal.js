import React from 'react';
import { ajax } from 'jquery';

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
			expenseType: ''
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
		this.portalHeader.classList.toggle('smaller')
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
		this.portalHeader.classList.toggle('smaller')
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
			expenseShow: false
		})
		

	}
	removeExpense(i) {
		const expensesArrayDuplicate = this.state.expensesArray;
		const indexToDelete = i;
		expensesArrayDuplicate.splice(i, 1);
		this.setState({
			expensesArray: expensesArrayDuplicate
		})
	}
	render() {
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
						<select name="expenseAmount">
							<option value="accomodation">Accomodation</option>
							<option value="food">Food</option>
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
					<article>
						<div className="tripsHeader">
							<h2>{this.state.tripsArray[this.state.tripIndex].tripName}</h2>
							<p>{this.state.tripsArray[this.state.tripIndex].tripBudget}</p>
							<p>{this.state.tripsArray[this.state.tripIndex].tripBudgetLeft}</p>
							<button className="btn" onClick={this.showExpenseForm}>Add an expense</button>
							<button className="btn" onClick={this.goBack}>Go back</button>
						</div>
						{this.state.tripsArray[this.state.tripIndex].expensesArray.map((expense, i) => {
							return (
								<div className="tripList">
									<div className="eachTrip">
									<h3>{expense.expenseName}</h3>
									<p>{expense.expenseAmount}</p>
									<p>{expense.expenseType}</p>
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
				<div>
					<h2>{this.state.tripsArray[this.state.tripIndex].tripName}</h2>
					<p>{this.state.tripsArray[this.state.tripIndex].tripBudgetLeft}</p>
				</div>	
				)
		}


		return (
			<div>
				{tripForm}
				{expenseForm}
				<header className="heroImage" ref={ref => this.portalHeader = ref}>
					<nav className="wrapper">
						<h2 className="logo">TripPlanner</h2>
						{headerDeets}
					</nav>
				</header>
				<div className="cta">Hello There! Welcome to the trip planner</div>

				{theTripPortal}
					
			</div>
				
		)
	}
}