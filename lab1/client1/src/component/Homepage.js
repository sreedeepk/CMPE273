import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class HomePage extends Component {

    state = {
        symbol: '',
        valueA: 0,
        valueB: 0,
        message: ''
    };

    // handleSubmit = (userdata) => {
    //     API.doLogin(userdata)
    //         .then((status) => {
    //             if (status === 201) {
    //                 this.setState({
    //                     isLoggedIn: true,
    //                     message: "Welcome to my App..!!"
    //                 });
    //             } else if (status === 401) {
    //                 this.setState({
    //                     isLoggedIn: false,
    //                     message: "Wrong username or password. Try again..!!"
    //                 });
    //             }
    //         });
    // };

    render() {
        return (
            <div className="container-fluid">
                <MuiThemeProvider>
                <TextField
                    name="valueA"
                />

                <TextField
                    name="valueB"
                />
                <button />
                </MuiThemeProvider>
            </div>
        );
    }
}

export default HomePage;