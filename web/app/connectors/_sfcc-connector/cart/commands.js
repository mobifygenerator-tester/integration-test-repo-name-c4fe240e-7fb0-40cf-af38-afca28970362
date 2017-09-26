/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {makeApiRequest, makeApiJsonRequest} from '../utils'
import {populateLocationsData} from '../checkout/utils'
import {requestCartData, createBasket, handleCartData, createNewBasket, isCartExpired, updateExpiredCart} from './utils'

export const getCart = () => (dispatch) =>
    requestCartData().then((basket) => dispatch(handleCartData(basket)))


const addToCartRequest = (productId, quantity, basketId) => {
    const requestBody = [{
        product_id: productId,
        quantity
    }]
    return makeApiJsonRequest(`/baskets/${basketId}/items`, requestBody, {method: 'POST'})
}

/**
 * @function addToCart
 * @param {String} productId The product's ID - if the product supports variants then this is the variant ID (cannot be master product ID)
 * @param {Number} quantity The quantity to add
 */
export const addToCart = (productId, quantity) => (dispatch) => (
    createBasket()
        .then((basket) => addToCartRequest(productId, quantity, basket.basket_id))
        .then((basket) => {
            if (isCartExpired(basket)) {
                // the basket has expired create a new one and try adding to cart again
                return dispatch(createNewBasket())
                    .then((basket) => addToCartRequest(productId, quantity, basket.basket_id))
            }
            return basket
        })
        .then((basket) => dispatch(handleCartData(basket)))
        .catch(() => { throw new Error('Unable to add item to cart') })
)


export const removeFromCart = (itemId) => (dispatch) => (
    createBasket()
        .then((basket) => makeApiRequest(`/baskets/${basket.basket_id}/items/${itemId}`, {method: 'DELETE'}))
        .then((response) => response.json())
        .then((basket) => dispatch(updateExpiredCart(basket)))
        .then((basket) => dispatch(handleCartData(basket)))
)


export const updateCartItem = (itemId, quantity, productId) => (dispatch) => {
    const requestBody = {
        quantity
    }

    if (productId) {
        requestBody.product_id = productId
    }

    return createBasket()
            .then((basket) => makeApiJsonRequest(`/baskets/${basket.basket_id}/items/${itemId}`, requestBody, {method: 'PATCH'}))
            .then((basket) => {
                if (isCartExpired(basket)) {
                    // the basket has expired create a new one and try adding to cart again
                    return dispatch(createNewBasket())
                        .then(() => addToCart(productId, quantity))
                }
                return basket
            })
            .catch(() => { throw new Error('Unable to update item') })
            .then((basket) => dispatch(handleCartData(basket)))
}


export const updateItemQuantity = (itemId, quantity) => (dispatch) => dispatch(updateCartItem(itemId, quantity))

export const initCartPage = () => (dispatch) => Promise.resolve(dispatch(populateLocationsData()))

export const fetchTaxEstimate = () => Promise.reject('Method not implemented')
