import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as API from '../api/API';
import * as _ from 'lodash';

const files = [
    {id: 1, name: 'Gator1.jpg'},
    {id: 2, name: 'Gator2.jpg'},
    {id: 3, name: 'Gator3.jpg'},
    {id: 4, name: 'Gator4.jpg'},
    {id: 5, name: 'Gator5.jpg'},
    {id: 6, name: 'Gator6.jpg'},
    {id: 7, name: 'Gator7.jpg'}
];

class Welcome extends Component {

    static propTypes = {
        email: PropTypes.string.isRequired,
        handleLogout: PropTypes.func.isRequired
    };


    state = {
        email : '',
        files: []
    };

    componentWillMount(){
        this.setState({
            email : this.props.email
        });
        //document.title = `Welcome, ${this.state.email} !!`;
    }

    componentDidMount(){
        document.title = `Welcome, ${this.state.email} !!`;
    }

    render(){
        
        console.log('Files ->',this.state.files);
        return(
            <div className="row justify-content-md-center">
                <div className="col-md-3">
                    {files.map(file => <div> {file.name} </div>)}
                    <div className="alert alert-warning" role="alert">
                        {this.state.email}, welcome to my App..!!
                    </div>
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
