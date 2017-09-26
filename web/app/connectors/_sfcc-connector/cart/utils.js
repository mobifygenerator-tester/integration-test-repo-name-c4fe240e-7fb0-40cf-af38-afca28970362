/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {makeApiRequest, getBasketID, storeBasketID, deleteBasketID, fetchItemData} from '../utils'
import {getCartItems} from 'progressive-web-sdk/dist/store/cart/selectors'
import {receiveCartProductData} from 'progressive-web-sdk/dist/integration-manager/products/results'
import {receiveCartContents, receiveCartItems} from 'progressive-web-sdk/dist/integration-manager/cart/results'

import {getProductThumbnailSrcById} from 'progressive-web-sdk/dist/store/products/selectors'

import {parseCartProducts, parseCartContents} from './parsers'

export const createBasket = (basketContents) => {
    const basketID = getBasketID()
    if (basketID && !basketContents) {
        return Promise.resolve({basket_id: basketID})
    }
    const options = {
        method: 'POST'
    }

    if (basketContents) {
        options.body = JSON.stringify(basketContents)
    }

    return makeApiRequest('/baskets', options)
        .then((response) => response.json())
        .then((basket) => {
            storeBasketID(basket.basket_id)
            return basket
        })
}

export const getProductImage = (item, currentState) => {
    const productImage = getProductThumbnailSrcById(item.product_id)(currentState)

    if (productImage) {
        // If we already have images for the item in our state, then just use those
        return Promise.resolve({
            src: productImage,
            alt: item.product_name
        })
    }

    // We have no images for the item in our state, fetch images using the Salseforce Commerce Cloud API
    return makeApiRequest(`/products/${item.product_id}/images?view_type=large`, {method: 'GET'})
        .then((response) => response.json())
        .then(({image_groups}) => ({
            src: image_groups[0].images[0].link,
            alt: item.product_name
        }))
}

/**
 * Fetches product images for items that are in the cart and don't already
 * have them.
 */
export const fetchCartItemData = () => (dispatch, getState) => {
    const items = getCartItems(getState()).toJS()

    return dispatch(fetchItemData(items))
        .then(({updatedProducts, updatedCartItems}) => {
            dispatch(receiveCartProductData(updatedProducts))
            dispatch(receiveCartItems(updatedCartItems))
        })
}

export const requestCartData = (noRetry) => (
    createBasket()
        .then((basket) => makeApiRequest(`/baskets/${basket.basket_id}`, {method: 'GET'}))
        .then((response) => {
            if (response.status === 404) {
                if (noRetry) {
                    throw new Error('Cart not found')
                }
                // Our basket has expired, clear and start over
                deleteBasketID()
                return requestCartData(true)
            }
            return response
        })
        .then((response) => response.json())
)

export const handleCartData = (basket) => (dispatch) => {
    // Note: These need to be dispatched in this order, otherwise there's
    //       a chance we could try to render cart items and not have product
    //       data in the store for it.
    dispatch(receiveCartProductData(parseCartProducts(basket)))
    dispatch(receiveCartContents(parseCartContents(basket)))

    return dispatch(fetchCartItemData())
}


export const createNewBasket = () => (dispatch) => {
    deleteBasketID()
    return requestCartData()
        .then((basket) => {
            dispatch(handleCartData(basket))
            return basket
        })
}

export const isCartExpired = ({fault}) => {
    if (fault) {
        if (fault.type === 'InvalidCustomerException' || fault.type === 'BasketNotFoundException') {
            return true
        }
        throw new Error(fault.message)
    }
    return false
}

// Check if the users cart has expired, if it has create a new one and throw an error
// otherwise return the cart object
export const updateExpiredCart = (basket) => (dispatch) => {
    if (isCartExpired(basket)) {
        return dispatch(createNewBasket())
            .then((basket) => dispatch(handleCartData(basket)))
            .then(() => { throw new Error('Your cart has expired.') })
    }
    return basket
}
