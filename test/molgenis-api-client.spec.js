import 'isomorphic-fetch'
import api from '../src/molgenis-api-client'
import fetchMock from 'fetch-mock'
import { expect } from 'chai'

const assertEquals = (actual, expected) => {
  expect(actual).to.equal(expected)
}

const assertDeepEquals = (actual, expected) => {
  expect(actual).to.deep.equal(expected)
}

const defaultOptions = {
  'headers': {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  'credentials': 'same-origin'
}

describe('Client Api', () => {
  describe('get', () => {
    afterEach(fetchMock.restore)

    it('should return the server response when content type is not json', done => {
      const response = {
        headers: {
          'content-type': 'my type'
        }
      }

      fetchMock.get('https://test.com/molgenis-test/get-something', response)
      const get = api.get('https://test.com/molgenis-test/get-something')

      get.then(res => {
        assertEquals(res.status, 200)
        const options = { 'method': 'GET', ...defaultOptions }
        assertDeepEquals(fetchMock.lastOptions('https://test.com/molgenis-test/get-something'), options)
      }).then(done, done)
    })

    it('should return merge the passed options with the default options', done => {
      const response = {
        headers: {
          'content-type': 'my type'
        }
      }

      const options = {
        'method': 'GET',
        'headers': {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        'credentials': 'same-origin'
      }
      fetchMock.get('https://test.com/molgenis-test/get-something', response, options)
      const get = api.get('https://test.com/molgenis-test/get-something', options)

      get.then(res => {
        assertEquals(res.status, 200)
        const expectedOptions = { 'method': 'GET', ...defaultOptions }
        assertDeepEquals(fetchMock.lastOptions('https://test.com/molgenis-test/get-something'), expectedOptions)
      }).then(done, done)
    })

    it('should NOT merge the passed options with the default options when forceOptions flag is set', done => {
      const response = {
        headers: {
          'content-type': 'my type'
        }
      }

      const options = {
        'method': 'GET',
        'headers': {
          'Accept': '*/*'
        },
        'credentials': 'same-origin'
      }
      fetchMock.get('https://test.com/molgenis-test/get-something', response, options)
      const get = api.get('https://test.com/molgenis-test/get-something', options, true)

      get.then(res => {
        assertEquals(res.status, 200)
        assertDeepEquals(fetchMock.lastOptions('https://test.com/molgenis-test/get-something'), options)
      }).then(done, done)
    })

    it('should honor rest verb change event if passed as option', done => {
      const response = {
        headers: {
          'content-type': 'my type'
        }
      }

      const optionsPassed = {
        'method': 'POST',
        'headers': {
          'Accept': '*/*'
        },
        'credentials': 'same-origin'
      }

      const mergedOptions = {
        'method': 'GET',
        'headers': {
          'Accept': '*/*'
        },
        'credentials': 'same-origin'
      }
      fetchMock.get('https://test.com/molgenis-test/get-something', response, mergedOptions)
      const get = api.get('https://test.com/molgenis-test/get-something', optionsPassed, true)

      get.then(res => {
        assertEquals(res.status, 200)
        assertDeepEquals(fetchMock.lastOptions('https://test.com/molgenis-test/get-something'), mergedOptions)
      }).then(done, done)
    })

    it('should return the server response json when content type is json', done => {
      const resultBody = { foo: 'bar' }
      const response = {
        headers: {
          'content-type': 'application/json"'
        },
        body: resultBody
      }

      fetchMock.get('https://test.com/molgenis-test/get-something', response)
      const get = api.get('https://test.com/molgenis-test/get-something')

      get.then(res => assertDeepEquals(res, resultBody)).then(done)
    })

    it('should return the server response json when content type is json with encoding', done => {
      const resultBody = { foo: 'bar' }
      const response = {
        headers: {
          'content-type': 'application/JSON; charset="utf-8"'
        },
        body: resultBody
      }

      fetchMock.get('https://test.com/molgenis-test/get-something', response)
      const get = api.get('https://test.com/molgenis-test/get-something')

      get.then(res => assertDeepEquals(res, resultBody)).then(done)
    })

    it('should return the server response json when content type is json with encoding and no white space before charset', done => {
      const resultBody = { foo: 'bar' }
      const response = {
        headers: {
          'content-type': 'application/json;charset=utf-8'
        },
        body: resultBody
      }

      fetchMock.get('https://test.com/molgenis-test/get-something', response)
      const get = api.get('https://test.com/molgenis-test/get-something')

      get.then(res => assertDeepEquals(res, resultBody)).then(done)
    })

    it('should reject the server response when response type is not json and not ok', done => {
      fetchMock.get('https://test.com/molgenis-test/get-something-not-ok', 400)
      const get = api.get('https://test.com/molgenis-test/get-something-not-ok')

      get.catch(res => assertEquals(res.status, 400)).then(done)
    })

    it('should reject the server response json and return the first error when content type is json but the request is not ok', done => {
      const resultBody = {
        errors: [{ message: 'its an error' }]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.get('https://test.com/molgenis-test/get-something-not-ok', response)
      const get = api.get('https://test.com/molgenis-test/get-something-not-ok')

      get.catch(res => assertDeepEquals(res, { errors: [{ message: 'its an error' }] })).then(done)
    })
  })

  describe('post', () => {
    afterEach(fetchMock.restore)

    const data = {
      items: ['1', '2'],
      status: 'SUCCESS'
    }

    const options = {
      body: JSON.stringify(data)
    }

    it('should return server status OK when post is successful', done => {
      fetchMock.post('https://test.com/molgenis-test/post-something', 200)
      const post = api.post('https://test.com/molgenis-test/post-something', options)

      post.then(res => assertEquals(res.status, 200)).then(done)
    })

    it('should return an error when post failed', done => {
      const resultBody = {
        errors: [{ message: 'its an error' }]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.post('https://test.com/molgenis-test/post-something-not-ok', response)
      const post = api.post('https://test.com/molgenis-test/post-something-not-ok', 'test.txt')

      post.catch(res => assertDeepEquals(res, { errors: [{ message: 'its an error' }] })).then(done)
    })

    it('should NOT merge the passed options with the default options when forceOptions flag is set', done => {
      const response = {
        headers: {
          'content-type': 'my type'
        }
      }

      const options = {
        'method': 'POST',
        'headers': {
          'Accept': '*/*'
        },
        'credentials': 'same-origin'
      }
      fetchMock.post('https://test.com/molgenis-test/post-something', response, options)
      const post = api.post('https://test.com/molgenis-test/post-something', options, true)

      post.then(res => {
        assertEquals(res.status, 200)
        assertDeepEquals(fetchMock.lastOptions('https://test.com/molgenis-test/post-something'), options)
      }).then(done, done)
    })
  })

  describe('put', () => {
    afterEach(fetchMock.restore)

    const data = {
      items: ['1', '2'],
      status: 'SUCCESS'
    }

    const options = {
      body: JSON.stringify(data)
    }

    it('should return server status OK when put is successful', done => {
      fetchMock.put('https://test.com/molgenis-test/put-something', 200)
      const put = api.put('https://test.com/molgenis-test/put-something', options)

      put.then(res => assertEquals(res.status, 200)).then(done)
    })

    it('should return an error when put failed', done => {
      const resultBody = {
        errors: [{ message: 'its an error' }]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.put('https://test.com/molgenis-test/put-something-not-ok', response)
      const put = api.put('https://test.com/molgenis-test/put-something-not-ok', options)

      put.catch(res => assertDeepEquals(res, { errors: [{ message: 'its an error' }] })).then(done)
    })

    it('should NOT merge the passed options with the default options when forceOptions flag is set', done => {
      const response = {
        headers: {
          'content-type': 'my type'
        }
      }

      const options = {
        'method': 'PUT',
        'headers': {
          'Accept': '*/*'
        },
        'credentials': 'same-origin'
      }
      fetchMock.put('https://test.com/molgenis-test/put-something', response, options)
      const put = api.put('https://test.com/molgenis-test/put-something', options, true)

      put.then(res => {
        assertEquals(res.status, 200)
        assertDeepEquals(fetchMock.lastOptions('https://test.com/molgenis-test/put-something'), options)
      }).then(done, done)
    })
  })

  describe('patch', () => {
    afterEach(fetchMock.restore)

    const data = {
      items: ['1', '2'],
      status: 'SUCCESS'
    }

    const options = {
      body: JSON.stringify(data)
    }

    it('should return server status OK when patch is successful', done => {
      fetchMock.patch('https://test.com/molgenis-test/patch-something', 200)
      const patch = api.patch('https://test.com/molgenis-test/patch-something', options)

      patch.then(res => assertEquals(res.status, 200)).then(done)
    })

    it('should return an error when patch failed', done => {
      const resultBody = {
        errors: [{ message: 'its an error' }]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.patch('https://test.com/molgenis-test/patch-something-not-ok', response)
      const patch = api.patch('https://test.com/molgenis-test/patch-something-not-ok', options)

      patch.catch(res => assertDeepEquals(res, { errors: [{ message: 'its an error' }] })).then(done)
    })

    it('should NOT merge the passed options with the default options when forceOptions flag is set', done => {
      const response = {
        headers: {
          'content-type': 'my type'
        }
      }

      const options = {
        'method': 'PATCH',
        'headers': {
          'Accept': '*/*'
        },
        'credentials': 'same-origin'
      }
      fetchMock.patch('https://test.com/molgenis-test/patch-something', response, options)
      const patch = api.patch('https://test.com/molgenis-test/patch-something', options, true)

      patch.then(res => {
        assertEquals(res.status, 200)
        assertDeepEquals(fetchMock.lastOptions('https://test.com/molgenis-test/patch-something'), options)
      }).then(done, done)
    })
  })

  describe('delete', () => {
    afterEach(fetchMock.restore)

    it('should return server status NO CONTENT when delete is successful', done => {
      fetchMock.delete('https://test.com/molgenis-test/delete-something', 204)
      const delete_ = api.delete_('https://test.com/molgenis-test/delete-something')

      delete_.then(res => assertEquals(res.status, 204)).then(done)
    })

    it('should return an error when delete failed', done => {
      const resultBody = {
        errors: [{ message: 'its an error' }]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.delete('https://test.com/molgenis-test/delete-something-not-ok', response)
      const delete_ = api.delete_('https://test.com/molgenis-test/delete-something-not-ok')

      delete_.catch(res => assertDeepEquals(res, { errors: [{ message: 'its an error' }] })).then(done)
    })

    it('should NOT merge the passed options with the default options when forceOptions flag is set', done => {
      const response = {
        headers: {
          'content-type': 'my type'
        }
      }

      const options = {
        'method': 'DELETE',
        'headers': {
          'Accept': '*/*'
        },
        'credentials': 'same-origin'
      }
      fetchMock.delete('https://test.com/molgenis-test/delete-something', response, options)
      const delete_ = api.delete_('https://test.com/molgenis-test/delete-something', options, true)

      delete_.then(res => {
        assertEquals(res.status, 200)
        assertDeepEquals(fetchMock.lastOptions('https://test.com/molgenis-test/delete-something'), options)
      }).then(done, done)
    })
  })

  describe('postFile', () => {
    afterEach(fetchMock.restore)

    it('should return a Job URL when post is successful', done => {
      const response = {
        headers: {
          'content-type': 'application/json'
        },
        body: {
          text: '/api/v2/job/test'
        }
      }

      fetchMock.post('https://test.com/molgenis-test/post-something', response)
      const post = api.postFile('https://test.com/molgenis-test/post-something', 'test.txt')

      post.then(res => assertEquals(res.text, '/api/v2/job/test')).then(done)
    })

    it('should return an error when post failed', done => {
      const resultBody = {
        errors: [{ message: 'its an error' }]
      }

      const response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }

      fetchMock.post('https://test.com/molgenis-test/post-something-not-ok', response)
      const post = api.post('https://test.com/molgenis-test/post-something-not-ok', 'test.txt')

      post.catch(res => assertDeepEquals(res, { errors: [{ message: 'its an error' }] })).then(done)
    })
  })
})
