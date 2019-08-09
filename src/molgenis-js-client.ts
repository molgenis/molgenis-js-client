import fetch from 'cross-fetch'
import { type } from 'os'
const MIMEType = require('whatwg-mimetype')

const defaultOptions: RequestInit = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  credentials: 'same-origin'
}

export interface ErrorWithResponse extends Error {
  response: Response
}

/**
 * Checks the status of a response.
 * @throws ErrorWithResponse if the status is not ok
 */
const raiseForStatus = (response: Response): Response => {
  if (!response.ok) {
    throw { ...new Error(response.statusText), response }
  }
  return response
}

const isJsonResponse = (response: Response): boolean => {
  const contentType = response.headers.get('content-type')
  if (!contentType) {
    return false
  }
  const mimeType = MIMEType.parse(contentType)
  return mimeType !== null && mimeType.essence === 'application/json'
}

/**
 * Handle the JSON response from the server.
 */
const parseJson = (response: Response): Promise<any> | Response =>
  isJsonResponse(response) ? response.json() : response

/**
 * Get a JSON object from the server
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
 * @param options An object containing additional options like headers or body
 */
const get = <T>(
  url: RequestInfo,
  options: RequestInit = defaultOptions
): Promise<T> =>
  fetch(url, { method: 'GET', ...options })
    .then(raiseForStatus)
    .then(parseJson)

/**
 * Post a body of data to the server
 *
 * @example <caption>Example of how to use the post method</caption>
 * // Post a data object and handle the response
 * const data = {
 *  items: ['1', '2'],
 *  id: 'example'
 * }
 *
 * const options = {
 *  ...defaultOptions,
 *  body: data
 * }
 *
 * post('api/v2/PostData', options).then(response => {...}, error => {...})
 *
 * @param url
 * @param options
 */
const post = <T>(
  url: RequestInfo,
  options: RequestInit = defaultOptions
): Promise<T> =>
  fetch(url, { method: 'POST', ...options })
    .then(raiseForStatus)
    .then(parseJson)

/**
 * Put a body of data to the server
 *
 * @example <caption>Example of how to use the post method</caption>
 * // Put a data object and handle the response
 * const data = {
 *  items: ['1', '2'],
 *  id: 'example'
 * }
 *
 * const options = {
 *  body: data
 * }
 *
 * put('api/v2/PostData', options).then(response => {...}, error => {...})
 *
 * @param url
 * @param options
 * @param forceOptions optional boolean if set to true options are not merged by used as passed, defaults to false
 */
const put = <T>(
  url: RequestInfo,
  options: RequestInit = defaultOptions
): Promise<T> =>
  fetch(url, { method: 'PUT', ...options })
    .then(raiseForStatus)
    .then(parseJson)

/**
 * Call a delete method on the server
 *
 * @example <caption>Example of how to use the delete_ method</caption>
 * // Handle the response from calling DELETE on /api/v2/deleteById/1
 * delete_('/api/v2/deleteById/1').then(response => {...}, error => {...})
 *
 * @param url
 * @param options
 */
// tslint:disable-next-line: variable-name
const delete_ = <T>(
  url: RequestInfo,
  options: RequestInit = defaultOptions
): Promise<T> =>
  fetch(url, { method: 'DELETE', ...options })
    .then(raiseForStatus)
    .then(parseJson)

export default { get, post, put, delete_, defaultOptions }
