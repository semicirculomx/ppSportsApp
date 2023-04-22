import { logout } from 'store/authSlice'

/**
 * request - general method for all requests handling authorisation within
 * @param {String} url url to fetch
 * @param {Object} options options for the request, including dispatch, body, headers, and method
 * @returns {Promise<Object>}
 */
export async function request(url, { dispatch, body, headers, method = 'GET' } = {}) {
    let res = await fetch(url, {
        method: (body !== undefined) && (method !== 'PUT') ?  'POST' : method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: JSON.stringify(body),
    })

    if (res.ok) {
        return res.json()
    } else if (res.status === 401) {
    // await dispatch(logout())
        throw Error('No autorizado')
    } else {
        throw Error('Algo salio mal')
    }
}