import React, {Component} from 'react';
import * as API from '../api/API';
import * as _ from 'lodash';

class HomePage extends Component {

    state = {
        symbol: '',
        valueA: 0,
        valueB: 0,
        result: 0,
        message: ''
    };

    handleSubmit = (state, operation) => {
        switch (operation) {
            case '+': 
                API.add(this.state).then(response => this.setState({
                    ...this.state,
                    result: _.get(response, 'res')
                }));
            break;
            case '-': 
                API.subtract(this.state).then(response => this.setState({
                    ...this.state,
                    result: _.get(response, 'res')
                }));
            break;
            case '*': 
                API.multiply(this.state).then(response => this.setState({
                    ...this.state,
                    result: _.get(response, 'res')
                }));
            break;
            case '/': 
                API.divide(this.state).then(response => this.setState({
                    ...this.state,
                    result: _.get(response, 'res', 0)
                }));
            break;
            default: this.setState({
                ...this.state,
                message: 'Operation not supported'
            });
        }
        console.log(this.state['result']);
    }

    render() {
        const style = {
            padding: 5,
            margin: 5
        }
        return (
            <div>
                <h1> Calculator App </h1>
                <div style={style}>
                    <label htmlFor="valueA">A: </label>
                    <input style={style}
                        label="valueA"
                        id="valueA"
                        type="text"
                        value={ this.state.valueA }
                        onChange={ (event) => this.setState({ ...this.state, valueA: event.target.value }) }
                    />
                    <br/>
                    <label htmlFor="valueB">B: </label>
                    <input style={style}
                        label="valueB"
                        id="valueB"
                        type="text"
                        value={ this.state.valueB }
                        onChange={ (event) => this.setState({ ...this.state, valueB: event.target.value }) }
                    />
                    <br/>
                    <label htmlFor="result">Result: </label>
                    <input style={style}
                        label="result"
                        id="result"
                        type="number"
                        value={ this.state.result }
                        onChange={ (event) => this.setState({ ...this.state, result: event.target.value }) }
                    />
                    <br/>
                </div>
                <div>
                    <button style={style} onClick={() => this.handleSubmit(this.state, '+')}><p>Add</p></button>
                    <button style={style} onClick={() => this.handleSubmit(this.state, '-')}><p>Subtract</p></button>
                    <button style={style} onClick={() => this.handleSubmit(this.state, '*')}><p>Multiply</p></button>
                    <button style={style} onClick={() => this.handleSubmit(this.state, '/')}><p>Divide</p></button>
                    <button style={style} onClick={() => this.setState({symbol: '', valueA: 0, valueB: 0, result: 0, message: ''})}><p>Clear</p></button>
                </div>
            </div>
        );
    }
}

export default HomePage;