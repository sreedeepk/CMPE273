import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as API from '../api/API';
class Welcome extends Component {



    state = {
        username : ''
    };

    componentWillMount(){
var a1;

        this.setState({
            username : this.props.userdata.username
        });

    }

    componentDidMount(){
        document.title = `Welcome, ${this.state.username} !!`;

        var ulnew=document.getElementById('userinfo');
        var a1;

        API.getfiles(this.state.username)
            .then((res) => {
                console.log("here");
                console.log(res.results.data);
                console.log("here2");
                // console.log(res.results.files);
                for(var res1234 in res.results.data) {
                    console.log(res1234);
                    // console.log(res.results.files[res1234]);
                    console.log(res.results.data[res1234]);
                    a1 = document.createElement("li");
                    // a1.appendChild(document.createTextNode(res.results.files['filename']));
                    a1.appendChild(document.createTextNode(res.results.data[res1234]['filename']));


                    ulnew.appendChild(a1);


                }
                if (res.data !== "err") {
                    this.setState({
                        isLoggedIn: true,
                        message: "Signup successful, Please login again...",
                        userdata: res.data
                    });

                }
                else {
                    this.setState({
                        isLoggedIn: false,
                        message: "Sign up failed. Try again..!!"
                    });




                }
            });
    }

    render(){
        return(
            <div className="row justify-content-md-center">
                <div className="col-md-3">
                    <div className="alert alert-warning" role="alert">
                        {this.state.username}, welcome to my App..!!
                    </div>
                    <h2>files</h2>
                    <ul id="userinfo"></ul>
                    <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => this.props.handleLogout(this.state)}>
                        Logout
                    </button>
                </div>
            </div>
        )
    }
}

export default Welcome;