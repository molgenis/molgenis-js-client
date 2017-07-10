import 'isomorphic-fetch'
import fetchMock from 'fetch-mock'
import * as api from 'molgenis-api-client'
import { expect } from 'chai'

describe('Client Api', () => {
  describe('get', () => {
    afterEach(fetchMock.restore)

    it('should return the result when response type is not json', (done) => {
      let response = {
        headers: {
          'content-type': 'my type'
        }
      }
      fetchMock.get('mogenis-test/get-something', response)
      const get = api.get('mogenis-test/get-something')
      get.then(function (response) {
        expect(response.status).to.equal(200)
        done()
      })
    })
    it('should return the just the json when response type is json', (done) => {
      const resultBody = {
        foo: 'bar'
      }
      let response = {
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }
      fetchMock.get('molgenis-test/get-something', response)
      const get = api.get('molgenis-test/get-something')
      get.then(function (response) {
        expect(response).to.deep.equal(resultBody)
        done()
      })
    })
    it('should fail when response type is not json and not ok', (done) => {
      fetchMock.get('molgenis-test/get-something-not-oke', 400)
      const get = api.get('molgenis-test/get-something-not-oke')
      get.catch(function (response) {
        expect(response.status).to.equal(400)
        done()
      })
    })
    it('should return the first error response type is json but the request is not oke', (done) => {
      const resultBody = {
        errors: [{message: 'its a error'}]
      }
      let response = {
        status: 400,
        headers: {
          'content-type': 'application/json'
        },
        body: resultBody
      }
      fetchMock.get('molgenis-test/get-something-not-oke', response)
      const get = api.get('molgenis-test/get-something-not-oke')
      get.catch(function (response) {
        expect(response).to.equal('its a error')
        done()
      })
    })
  })
})
