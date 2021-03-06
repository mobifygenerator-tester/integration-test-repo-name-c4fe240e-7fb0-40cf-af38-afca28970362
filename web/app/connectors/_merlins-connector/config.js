/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import {buildQueryString} from '../../utils/utils'

const SEARCH_URL = '/catalogsearch/result/'
const SEARCH_SUGGESTION_URL = '/search/ajax/suggest/'

export const CHECKOUT_SHIPPING_URL = '/checkout/'
export const CART_URL = '/checkout/cart/'
export const WISHLIST_URL = '/wishlist/'
export const SIGN_IN_URL = '/customer/account/login/'
export const PAYMENT_URL = '/checkout/payment/'
export const CREATE_ACCOUNT_POST_URL = '/customer/account/createpost/'
export const LOGIN_POST_URL = '/customer/account/loginPost/'
export const MY_ACCOUNT_URL = '/customer/account/'
export const ACCOUNT_ADDRESS_URL = '/customer/address/'
export const ACCOUNT_INFO_URL = '/customer/account/edit/'
export const ACCOUNT_ORDER_LIST_URL = '/sales/order/history/'
export const UPDATE_WISHLIST_URL = '/wishlist/index/updateItemOptions/'

export const getWishlistQuantityUrl = (wishlistId) => `/wishlist/index/update/wishlist_id/${wishlistId}/`
export const buildQueryURL = (query) => `${SEARCH_SUGGESTION_URL}${buildQueryString(query)}&_=${Date.now()}`
export const buildSearchURL = (query) => `${SEARCH_URL}${buildQueryString(query)}`

export const getDeleteAddressURL = (addressId, formKey) => `https://www.merlinspotions.com/customer/address/delete/id/${addressId}/form_key/${formKey}`

// configuration is not currently used by the Merlin's connector
let config = {} // eslint-disable-line

export const registerConfig = (cfg) => {
    config = cfg
}
