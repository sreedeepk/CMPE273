import React, {Component} from 'react';
import { Route, withRouter } from 'react-router-dom';
import * as API from '../api/API';
import Login from "./Login";
import Message from "./Message";
import Welcome from "./Welcome";
import SignUp from "./signUp";

class NewerHomePage extends Component {

    state = {
        isLoggedIn: false,
        message: '',
        userdata: ''
    };

    handleSignup = (userdata) => {
           API.doSignup(userdata)
            .then((res) => {
                if (res.data !== "err") { 
                    this.setState({
                        isLoggedIn: true,
                        message: "Signup successful, Please login again...",
                        userdata: res.data
                    });
                    this.props.history.push("/");
                }
               else {
                    this.setState({
                        isLoggedIn: false,
                        message: "Sign up failed. Try again..!!"
                    });
                }
            });
    }
    handleSubmit = (userdata) => {       
        API.doLogin(userdata)
            .then((res) => {
            console.log(res);
                if (res.data !== "err") {
                    this.setState({
                        isLoggedIn: true,
                        message: "",
                        userdata: res.userdata
                    });
                    this.props.history.push("/welcome");
                } else {
                    var a=this.state;
                    a.isLoggedIn = false;
                    a.message = "Wrong username or password. Try again..!!";
                    this.setState(a);
                }
            });
    };

    handleLogout = () => {
        console.log('logout called');
        API.logout()
            .then((status) => {
                if(status === 200){
                    this.setState({
                        isLoggedIn: false
                    });
                    this.props.history.push("/");
                }
            });
    };


    render() {
        return (
            <div className="container-fluid">
                <Route exact path="/" render={() => (
                    <div>
            <div>
                        <Login handleSubmit={this.handleSubmit}/>
                        <Message message={this.state.message}/>
                    </div>
                        <button className="btn btn-success" onClick={() => {
                            this.props.history.push("/signup");
                        }}>
                            Signup
                        </button>
                    </div>
                )}/>

                <Route exact path="/login" render={() => (
                    <div>
                        <Login handleSubmit={this.handleSubmit}/>
                        <Message message={this.state.message}/>
                    </div>
                )}/>
                <Route exact path="/signup" render={() => (
                    <div>
                        <SignUp handleSignup={this.handleSignup}/>
                        
                    </div>
                )}/>
                <Route exact path="/welcome" render={() => (
                    <Welcome handleLogout={this.handleLogout} userdata={this.state.userdata} isLoggedIn={this.state.isLoggedIn}/>
                )}/>
            </div>
        );
    }
}

export default withRouter(NewerHomePage);