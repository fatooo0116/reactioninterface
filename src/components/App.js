import React, { Component } from 'react';

import AddAppointments from './AddAppointments';
import SearchAppointments from './SearchAppointments';
import ListAppointments from './ListAppointments';

import {without} from 'lodash';


import '../css/App.css';

class App extends Component {
  constructor(){
    super();

    this.state = {
      myName: 'Ray',
      myAppointments:[],
      fromDisplay:true,
      orderBy:'petName',
      orderDir:'asc',
      queryText:'',
      lastIndex:0
    }

    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.AddAppointments = this.AddAppointments.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
   
  }

  componentDidMount(){
    fetch('./data.json')
      .then(response => response.json() )
      .then(result => {

        const apts = result.map(item => {
          item.aptId = this.state.lastIndex;
          this.setState({lastIndex:this.state.lastIndex+1});
          return item;
        });

        this.setState({
          ...this.state,
          myAppointments: apts
        });
        
        
      });
  }


  deleteAppointment(apt){
    let tempApts = this.state.myAppointments
    console.log(apt);
    tempApts = without(tempApts,apt);
    this.setState({
      myAppointments:tempApts
    })
  }

  toggleForm(){
    this.setState({
      fromDisplay: !this.state.fromDisplay
    })
  }


  AddAppointments(apt){
    let tempApts  = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({
      myAppointments:tempApts,
      lastIndex:this.state.lastIndex+1
    });
  }


  changeOrder(order,dir){
    this.setState({
      orderBy:order,
      orderDir:dir
    });
  }


  searchApts(query){
    this.setState({ queryText:query });
  }




  render() {

    console.log(this.state.myAppointments);

    let order;
    let filteredApts = this.state.myAppointments;

    if(this.state.orderDir==='asc'){
        order=1;
    } else {
        order=-1;
    }

    filteredApts = filteredApts.sort((a,b)=>{
        if(a[this.state.orderBy].toLowerCase() < b[this.state.orderBy].toLowerCase()){
            return -1 * order;
        }else{
            return 1 * order;
        }
    }).filter(eachItem => {
      return(
        eachItem['petName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['ownerName']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase()) ||
        eachItem['aptNotes']
        .toLowerCase()
        .includes(this.state.queryText.toLowerCase())
      )
    });


    
    

    return (
      <main  className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                
                <AddAppointments  AddAppointments={this.AddAppointments} toggleForm={this.toggleForm} fromDisplay={this.state.fromDisplay} />
                <SearchAppointments  searchApts={this.searchApts} changeOrder={this.changeOrder} orderBy={this.state.orderBy}  orderDir={this.state.orderDir} />
                <ListAppointments  deleteAppointment={this.deleteAppointment}  appointments={filteredApts} />

              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
