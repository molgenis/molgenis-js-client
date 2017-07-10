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

/**
 * Get a JSON object from the server
 * Uses your session ID to authenticate
 *
 * @param url The URL to post to e.g. /api/v2/my_data_set
 * @param options_ An object containing additional options like headers or body
 */
export const get = (url: string, options_: ?Options) => {
  const options: Options = merge({method: GET}, defaultOptions, options_)
  return fetch(url, options).then(response => {
    if (response.headers.get('content-type') === 'application/json') {
      return response.json().then(json => response.ok ? json : Promise.reject(json.errors[0].message))
    } else {
      return response.ok ? response : Promise.reject(response)
    }
  })
}

/**
 * Post a body of data to the server
 * Uses your session ID to authenticate
 *
 * @param url
 * @param options_
 */
export const post = (url: string, options_: ?Options) => {
  const options: Options = merge({method: POST}, defaultOptions, options_)
  return fetch(url, options).then(response => {
    if (response.headers.get('content-type') === 'application/json') {
      return response.json().then(json => response.ok ? json : Promise.reject(json.errors[0].message))
    } else {
      return response.ok ? response : Promise.reject(response)
    }
  })
}

/**
 * Call a delete method on the server
 * Uses your session ID to authenticate
 *
 * @param url
 * @param options_
 */
export const delete_ = (url: string, options_: ?Options) => {
  const options: Options = merge({method: DELETE}, defaultOptions, options_)
  return fetch(url, options).then(response => {
    if (response.headers.get('content-type') === 'application/json') {
      return response.json().then(json => response.ok ? json : Promise.reject(json.errors[0].message))
    } else {
      return response.ok ? response : Promise.reject(response)
    }
  })
}
