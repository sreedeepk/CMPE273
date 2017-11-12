const url = 'http://localhost:5000';

const headers = {
    'Accept': 'application/json'
}

export const add = (payload) => {
    return fetch(`${url}/add?valueA=${payload.valueA}&valueB=${payload.valueB}`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
    }).then(result => result.json())
}

export const subtract = (payload) => {
    return fetch(`${url}/subtract?valueA=${payload.valueA}&valueB=${payload.valueB}`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
    }).then(result => result.json())
}

export const multiply = (payload) => {
    return fetch(`${url}/multiply?valueA=${payload.valueA}&valueB=${payload.valueB}`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
    }).then(result => result.json())
}

export const divide = (payload) => {
    return fetch(`${url}/divide?valueA=${payload.valueA}&valueB=${payload.valueB}`, {
        method: 'GET',
        headers: {
            ...headers,
            'Content-Type': 'application/json'
        },
    }).then(result => result.json())
}