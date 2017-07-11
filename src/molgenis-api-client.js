// @flow
import 'isomorphic-fetch'
import { merge } from 'lodash'

const GET = 'GET'
const POST = 'POST'
const DELETE = 'DELETE'

type Options = {
  headers?: Object,
  credentials?: string,
  redirect?: string,
  method?: string,
  body?: any,
  mode?: string
}

const defaultOptions: Options = {
  'headers': {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  'credentials': 'same-origin',
  'redirect': 'error'
}

const handleResponse = (response) => {
  if (response.headers.get('content-type') === 'application/json') {
    return response.json().then(json => response.ok ? json : Promise.reject(json.errors[0].message))
  } else {
    return response.ok ? response : Promise.reject(response)
  }
}

const mergeOptions = (method, options): Options => {
  return merge({method: method}, defaultOptions, options)
}

/**
 * Get a JSON object from the server
 * Uses your session ID to authenticate
 *
 * @param url The URL to post to e.g. /api/v2/my_data_set
 * @param options_ An object containing additional options like headers or body
 */
export const get = (url: string, options_: ?Options) => {
  const options: Options = mergeOptions(GET, options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}

/**
 * Post a body of data to the server
 * Uses your session ID to authenticate
 *
 * @param url
 * @param options_
 */
export const post = (url: string, options_: ?Options) => {
  const options: Options = mergeOptions(POST, options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}

/**
 * Call a delete method on the server
 * Uses your session ID to authenticate
 *
 * @param url
 * @param options_
 */
export const delete_ = (url: string, options_: ?Options) => {
  const options: Options = mergeOptions(DELETE, options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}
