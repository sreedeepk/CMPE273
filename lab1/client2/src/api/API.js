import * as _ from 'lodash';
const api = process.env.REACT_APP_CONTACTS_API_URL || 'http://localhost:5000'

const headers = {
    'Accept': 'application/json'
};

export const doLogin = (payload) => {
    const formBody = [];
    console.log('payload -> ',payload);
    _.each(payload, property => {
        const encodedKey = encodeURIComponent(property);
        const encodedValue = encodeURIComponent(payload[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    });
    console.log(formBody);
    return fetch(`${api}/users/signin`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
        }).then(res => {
            console.log(res);
            return res.status;
        })
        .catch(error => {
            console.log("This is error");
            return error;
        });
    }

export const signout = () =>
    fetch(`${api}/users/signout`, {
        method: 'POST',
        headers: {
            ...headers
        },
    }).then(res => {
        return res.status;
    })
        .catch(error => {
            console.log("This is error");
            return error;
        });


export const fetchFiles = () => {
       return fetch(`${api}/files`, {
            method: 'GET',
            headers: {
                ...headers
            },
        }).then(res =>  res.json())
    }