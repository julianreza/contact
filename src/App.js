import React, { Component } from 'react';
import ReactTable from "react-table";
import Modal from 'react-responsive-modal';
import "react-table/react-table.css";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      open: false,
      firstName:'',
      lastName:'',
      age:0,
      id:'',
      photo:'N/A'
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  onOpenModal = () => {
    this.setState(
      {
        open: true,
        firstName:'',
        lastName:'',
        age:0,
        id:'',
        photo:'N/A'
      }
      );
  };
 
  onCloseModal = () => {
    this.setState({ open: false });
  };

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleDelete = (e) =>{
    const id = e.target.value
    fetch("https://simple-contact-crud.herokuapp.com/contact/"+id,{
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })
    this.getdata()
    this.onCloseModal()
  }

  handleSubmit() {
    if(this.state.id !== ""){
      fetch("https://simple-contact-crud.herokuapp.com/contact/"+this.state.id,{
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        age: this.state.age
      })
    })
    this.getdata()
    }
    else{
      fetch("https://simple-contact-crud.herokuapp.com/contact",{
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          age: this.state.age
        })
      })
      this.getdata()
    }
    this.getdata()
    this.onCloseModal()
  }

  getdata = () =>{
    fetch("https://simple-contact-crud.herokuapp.com/contact")
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          data: result.data
        });
      },
      (error) => {
        console.log('error',error)
      }
    )
  }

  getdatabyid = (e) =>{
    const id = e.target.value
    fetch("https://simple-contact-crud.herokuapp.com/contact/"+id)
    .then(res => res.json())
    .then(
      (result) => {
        this.onOpenModal()
        this.setState({
          id:id,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          age: result.data.age
        });
      },
      (error) => {
        console.log('error',error)
      }
    )
  }

  componentDidMount = () =>{
    this.getdata()
  }

  render() {
    const {data, open}  = this.state;   
    return (
      <div>
        <button onClick={this.onOpenModal}>Add</button>
        <ReactTable
          columns={[
              {
                Header: "Id",
                accessor: "id",
                width:400
              },
              {
                Header: "First Name",
                accessor: "firstName"
              },
              {
                Header: "Last Name",
                accessor: "lastName"
              },
              {
                Header: "Age",
                accessor: "age",
                width:50
              },
              {
                Header: "Photo",
                accessor: "photo",
                width: 150,
                Cell: row =>(
                  <div>
                    <img
                    src={row.value!=='N/A' ? row.value : "https://wingslax.com/wp-content/uploads/2017/12/no-image-available.png"}
                    style={{borderRadius:'100px',width:'100px',height:'100px'}}
                    ></img>
                  </div>
                )
              },
              {
                Header:"Action",
                Cell: ({row,original}) =>(
                  <div>
                    <button value={original.id} onClick={this.getdatabyid}>Edit</button>
                    <button value={original.id} onClick={this.handleDelete}>Delete</button>
                  </div>
                )
              }
            ]}
          defaultPageSize={5}
          className="-striped -highlight"
          data={data}
        />
        <Modal open={open} onClose={this.onCloseModal} center>
          <h2>Contact</h2>
          <form>
            <label>
              First Name
              <input type="text" name="firstName" minLength={3} value={this.state.firstName} onChange={this.handleChange} />
            </label>
            <br></br>
            <label>
              Last Name
              <input type="text" name="lastName" minLength={3} value={this.state.lastName} onChange={this.handleChange} />
            </label>
            <br></br>
            <label>
              Age
              <input type="number" name="age" value={this.state.age} onChange={this.handleChange} />
            </label>
            <br></br>
          </form>
          <button onClick={this.handleSubmit}>Save</button>
        </Modal>
      </div>
    );
  }
}

export default App;
