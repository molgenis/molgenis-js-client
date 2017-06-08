// @flow
import fetch from 'isomorphic-fetch'

export type Server = {
  apiUrl: string
}

export type Settings = {
  method?: string,
  body?: any,
  headers?: any,
  credentials?: string,
  mode?: string
}

const jsonContentHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

function fetchAndHandleResponse (url: string, settings: Settings) {
  return fetch(url, settings)
    .then(response => response.json()
      .then(json => ({json, response})))
    .then(({json, response}) => {
      if (!response.ok) {
        return Promise.reject(json)
      }
      return json
    })
}

export function submitForm (url: string, method: string, formData: any, token: ?string) {
  const settings: Settings = {
    method: method,
    body: formData
  }
  if (token) {
    // for cross-origin requests, use a molgenis token
    settings.headers = {...settings.headers, 'x-molgenis-token': token}
    settings.mode = 'cors'
  } else {
    // for same origin requests, use the JSESSIONID cookie
    settings.credentials = 'same-origin'
  }
  return fetchAndHandleResponse(url, settings)
}

function callApi (server: Server, uri: string, method: string, token: ?string) {
  const url = server.apiUrl + uri
  const settings: Settings = {
    method: method,
    headers: jsonContentHeaders
  }

  if (token) {
    // for cross-origin requests, use a molgenis token
    settings.headers = {...jsonContentHeaders, 'x-molgenis-token': token}
  } else {
    // for same origin requests, use the JSESSIONID cookie
    settings.credentials = 'same-origin'
  }

  return fetchAndHandleResponse(url, settings)
}

export function get (server: Server, uri: string, token: ?string) {
  return callApi(server, uri, 'get', token)
}

export function login (username: string, password: string) {
  return fetch('/api/v1/login', {
    method: 'post',
    headers: jsonContentHeaders,
    body: JSON.stringify({username: username, password: password})
  }).then(response => response.json())
}

export function logout (server: Server, token: string) {
  return fetch(server.apiUrl + 'v1/logout', {
    method: 'get',
    headers: {...jsonContentHeaders, 'x-molgenis-token': token}
  })
}

export default {login, logout, get, callApi}
