import fetch from 'isomorphic-fetch'
import { merge } from 'lodash'

const defaultOptions = {
  'headers': {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  'credentials': 'same-origin'
}

const handleResponse = (response) => {
  if (response.headers.get('content-type') === 'application/json') {
    return response.json().then(json => response.ok ? json : Promise.reject(json.errors[0].message))
  } else {
    return response.ok ? response : Promise.reject(response)
  }
}

const mergeOptions = (method, options) => {
  return merge({method: method}, defaultOptions, options)
}

/**
 * Get a JSON object from the server
 * Uses your session ID to authenticate
 *
 * @example <caption>Example of how to use the get method</caption>
 * // Handle a promise from calling /api/v2/EntityType
 * get('/api/v2/EntityType').then(response => {...}, error => {...}))
 *
 * @example <caption>Example of how to use the get method with an added option</caption>
 * // Handle a promise from calling /api/v2/EntityType with different content type
 * get('/api/v2/EntityType', { headers: { 'Content-type': 'text' } }).then(response => {...}, error => {...})
 *
 * @param url The URL to post to e.g. /api/v2/my_data_set
 * @param options_ An object containing additional options like headers or body
 */
const get = (url, options_) => {
  const options = mergeOptions('GET', options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}

/**
 * Post a body of data to the server
 * Uses your session ID to authenticate
 *
 * @example <caption>Example of how to use the post method</caption>
 * // Post a data object and handle the response
 * const data = {
 *  items: ['1', '2'],
 *  id: 'example'
 * }
 *
 * const options = {
 *  body: data
 * }
 *
 * post('api/v2/PostData', options).then(response => {...}, error => {...})
 *
 * @param url
 * @param options_
 */
const post = (url, options_) => {
  const options = mergeOptions('POST', options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}

/**
 * Call a delete method on the server
 * Uses your session ID to authenticate
 *
 * @example <caption>Example of how to use the delete_ method</caption>
 * // Handle the response from calling DELETE on /api/v2/deleteById/1
 * delete_('/api/v2/deleteById/1').then(response => {...}, error => {...})
 *
 * @param url
 * @param options_
 */
const delete_ = (url, options_) => {
  const options = mergeOptions('DELETE', options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}

export default {get, post, delete_}
