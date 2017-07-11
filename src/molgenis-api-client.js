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
export const get = (url: string, options_: ?Options) => {
  const options: Options = mergeOptions(GET, options_)
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
export const post = (url: string, options_: ?Options) => {
  const options: Options = mergeOptions(POST, options_)
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
export const delete_ = (url: string, options_: ?Options) => {
  const options: Options = mergeOptions(DELETE, options_)
  return fetch(url, options).then(handleResponse).then(response => response)
}

export default {get, post, delete_}