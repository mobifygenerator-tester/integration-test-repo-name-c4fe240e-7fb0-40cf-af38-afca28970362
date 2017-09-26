/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import * as utils from '../utils'
import {
    receiveNavigationData,
    receiveSearchSuggestions,
    setLoggedIn,
    setCheckoutShippingURL,
    setCartURL,
    setSignInURL,
    setWishlistURL,
    setAccountInfoURL,
    setAccountAddressURL,
    setAccountOrderListURL,
    setAccountURL
} from 'progressive-web-sdk/dist/integration-manager/results'
import {receiveUserEmail} from 'progressive-web-sdk/dist/integration-manager/checkout/results'
import {parseCategories, parseSearchSuggestions} from '../parsers'
import {browserHistory} from 'progressive-web-sdk/dist/routing'

import {
    getSignInURL,
    getCheckoutShippingURL,
    getCartURL,
    getWishlistURL,
    buildSearchURL,
    getAccountAddressURL,
    getAccountInfoURL,
    getDashboardURL,
    getAccountOrderListURL
} from '../config'
import {
    ACCOUNT_NAV_ITEM,
    SIGNED_OUT_ACCOUNT_NAV_ITEM,
    GUEST_NAV,
    LOGGED_IN_NAV
} from '../../../modals/navigation/constants'


export const fetchNavigationData = () => (dispatch) => {
    return utils.makeUnAuthenticatedApiRequest('/categories/root?levels=2', {method: 'GET'})
        .then((response) => response.json())
        .then(({categories}) => {
            const navData = parseCategories(categories)

            const isLoggedIn = utils.isUserLoggedIn(utils.getAuthToken())
            const accountNode = [
                {
                    type: isLoggedIn ? ACCOUNT_NAV_ITEM : SIGNED_OUT_ACCOUNT_NAV_ITEM,
                    title: 'My Account',
                    options: {
                        icon: 'user',
                        className: 'u-margin-top-md u-border-top'
                    },
                    path: getDashboardURL()
                },
                {
                    type: isLoggedIn ? ACCOUNT_NAV_ITEM : SIGNED_OUT_ACCOUNT_NAV_ITEM,
                    title: 'Wishlist',
                    options: {
                        icon: 'star'
                    },
                    path: getWishlistURL()
                },
                {
                    ...(isLoggedIn ? LOGGED_IN_NAV : GUEST_NAV),
                    options: {
                        icon: isLoggedIn ? 'lock' : 'user',
                        className: !isLoggedIn ? 'u-margin-top-md u-border-top' : ''
                    },
                    path: getSignInURL()
                }
            ]

            return dispatch(receiveNavigationData({
                path: '/',
                root: {
                    title: 'root',
                    path: '/',
                    children: navData.concat(accountNode)
                }
            }))
        })
}

export const getSearchSuggestions = (query) => (dispatch) => {
    // SFCC API requires min length of 3
    if (query.length < 3) {
        return dispatch(receiveSearchSuggestions(null))
    }
    const queryURL = `/search_suggestion?q=${query}`
    return utils.makeApiRequest(queryURL)
        .then((response) => response.json())
        .then((responseJSON) => dispatch(receiveSearchSuggestions(parseSearchSuggestions(responseJSON))))
}

export const searchProducts = (query) => (dispatch) => {
    browserHistory.push(buildSearchURL(query))
}

export const initApp = () => (dispatch) => {
    return utils.initSfccAuthAndSession()
        .then(() => dispatch(fetchNavigationData()))
        .then(() => {
            const customerData = utils.getCustomerData(utils.getAuthToken())
            dispatch(setCheckoutShippingURL(getCheckoutShippingURL()))
            dispatch(setCartURL(getCartURL()))
            dispatch(setWishlistURL(getWishlistURL()))
            dispatch(setSignInURL(getSignInURL()))
            dispatch(setAccountOrderListURL(getAccountOrderListURL()))
            dispatch(setAccountAddressURL(getAccountAddressURL()))
            dispatch(setAccountInfoURL(getAccountInfoURL()))
            dispatch(setAccountURL(getDashboardURL()))
            if (!customerData.guest) {
                dispatch(setLoggedIn(true))
                return utils.makeApiRequest(`/customers/${customerData.customer_id}`, {method: 'GET'})
                    .then((response) => response.json())
                    .then(({email}) => {
                        return dispatch(receiveUserEmail(email))
                    })
            }

            return dispatch(setLoggedIn(false))
        })
}
