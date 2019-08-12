jest.mock('cross-fetch')
import fetch from 'cross-fetch'
const { Response } = jest.requireActual('cross-fetch')
import api from '../src/molgenis-js-client'

const mockFetch = fetch as jest.Mocked<any>

const defaultOptions: RequestInit = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  credentials: 'same-origin'
}

const passedOptions: RequestInit = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'text/plain',
    'X-Requested-With': 'XMLHttpRequest'
  }
}

describe('Client Api', () => {
  const response: Response = new Response()
  const url = 'http://example.com/blah'

  beforeEach(() => mockFetch.mockReset())

  describe('Response handling', () => {
    it('should return the server response when content type is not json', () => {
      const textResponse = new Response('hi', {
        headers: { 'Content-Type': 'text/plain' }
      })

      mockFetch.mockResolvedValue(textResponse)
      const result = api.get<Response>(url)

      return result.then(res => {
        expect(res).toBe(textResponse)
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'GET',
          ...defaultOptions
        })
      })
    })

    it('should return the server response json when content type is json', () => {
      const json = { foo: 'bar' }
      const response: Response = new Response(JSON.stringify(json), {
        headers: { 'content-type': 'application/JSON; charset="utf-8"' }
      })

      mockFetch.mockResolvedValue(response)
      const result = api.get(url)

      return result.then(res => expect(res).toEqual(json))
    })

    it('should reject an error with the complete server response when its status is not ok', () => {
      const json = { foo: 'bar' }
      const response: Response = new Response(JSON.stringify(json), {
        headers: { 'content-type': 'application/json' },
        status: 400,
        statusText: 'Unauthorized'
      })

      mockFetch.mockResolvedValue(response)
      const result = api.get(url)

      return result.catch(res =>
        expect(res).toEqual({ ...new Error('Unautorized'), response })
      )
    })
  })

  describe('get', () => {
    it('should add the request method to the default options', () => {
      mockFetch.mockResolvedValue(response)
      const result = api.get<Response>(url)
      return result.then(() =>
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'GET',
          ...defaultOptions
        })
      )
    })

    it('should add the request method to the passed options', () => {
      const passedOptions: RequestInit = {
        headers: {
          'Content-Type': 'text/plain'
        }
      }
      mockFetch.mockResolvedValue(response)

      const result = api.get<Response>(url, passedOptions)

      const expectedOptions: RequestInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'text/plain'
        }
      }
      return result.then(() =>
        expect(mockFetch).toHaveBeenCalledWith(url, expectedOptions)
      )
    })

    it('should prefer the method that is passed as option', () => {
      const passedOptions: RequestInit = {
        headers: {
          'Content-Type': 'text/plain'
        },
        method: 'POST'
      }
      mockFetch.mockResolvedValue(response)

      const result = api.get<Response>(url, passedOptions)

      return result.then(() =>
        expect(mockFetch).toHaveBeenCalledWith(url, passedOptions)
      )
    })
  })

  describe('post', () => {
    it('should add the request method to the default options', () => {
      mockFetch.mockResolvedValue(response)
      const result = api.post<Response>(url)
      return result.then(() =>
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'POST',
          ...defaultOptions
        })
      )
    })

    it('should add the request method to the passed options', () => {
      mockFetch.mockResolvedValue(response)
      const result = api.post<Response>(url, defaultOptions)
      return result.then(() =>
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'POST',
          ...defaultOptions
        })
      )
    })
  })

  describe('put', () => {
    it('should add the request method to the default options', () => {
      mockFetch.mockResolvedValue(response)
      const result = api.put<Response>(url)
      return result.then(() =>
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'PUT',
          ...defaultOptions
        })
      )
    })

    it('should add the request method to the passed options', () => {
      mockFetch.mockResolvedValue(response)
      const result = api.put<Response>(url, defaultOptions)
      return result.then(() =>
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'PUT',
          ...defaultOptions
        })
      )
    })
  })

  describe('delete', () => {
    it('should add the request method to the default options', () => {
      mockFetch.mockResolvedValue(response)
      const result = api.delete_<Response>(url)
      return result.then(() =>
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'DELETE',
          ...defaultOptions
        })
      )
    })

    it('should add the request method to the passed options', () => {
      mockFetch.mockResolvedValue(response)
      const result = api.delete_<Response>(url, defaultOptions)
      return result.then(() =>
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: 'DELETE',
          ...defaultOptions
        })
      )
    })
  })
})
