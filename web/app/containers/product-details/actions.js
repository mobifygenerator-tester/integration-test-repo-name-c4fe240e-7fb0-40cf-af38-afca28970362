/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {getWishlistID, getIsLoggedIn} from 'progressive-web-sdk/dist/store/user/selectors'
import {SubmissionError} from 'redux-form'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getItemQuantity} from './selectors'
import {getWishlistURL, getSignInURL} from '../app/selectors'
import {
    getCurrentProductId,
    getProductVariants,
    getProductVariationCategories,
    getProductVariationCategoryIds
} from 'progressive-web-sdk/dist/store/products/selectors'
import {getAddToCartFormValues} from '../../store/form/selectors'
import {addToCart, updateCartItem} from 'progressive-web-sdk/dist/integration-manager/cart/commands'
import {getProductVariantData, addItemToWishlist} from 'progressive-web-sdk/dist/integration-manager/products/commands'
import {updateWishlistItem} from 'progressive-web-sdk/dist/integration-manager/account/commands'
import {openModal, closeModal} from 'progressive-web-sdk/dist/store/modals/actions'
import {addNotification} from 'progressive-web-sdk/dist/store/notifications/actions'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {PRODUCT_DETAILS_ITEM_ADDED_MODAL} from '../../modals/constants'
import * as appActions from '../app/actions'

export const setIsWishlistAdded = createAction('Set is wishlist added', ['isWishlistAdded'])
export const receiveNewItemQuantity = createAction('Set item quantity')
export const setItemQuantity = (quantity) => (dispatch, getStore) => {
    dispatch(receiveNewItemQuantity({
        [getCurrentProductId(getStore())]: {
            itemQuantity: quantity
        }
    }))
}

export const addToCartStarted = createAction('Add to cart started')
export const addToCartComplete = createAction('Add to cart complete')

export const goToCheckout = () => (dispatch) => {
    dispatch(closeModal(PRODUCT_DETAILS_ITEM_ADDED_MODAL, UI_NAME.addToCart))
    dispatch(appActions.goToCheckout())
}

export const goToWishlist = () => (dispatch, getState) => {
    dispatch(setIsWishlistAdded(false))
    dispatch(closeModal(PRODUCT_DETAILS_ITEM_ADDED_MODAL, UI_NAME.wishlist))

    browserHistory.push({
        pathname: getWishlistURL(getState())
    })
}

const submitCartFormSelector = createPropsSelector({
    productId: getCurrentProductId,
    qty: getItemQuantity,
    variationCategories: getProductVariationCategories,
    variants: getProductVariants
})

/**
 * @param {Object} formValues form values of selected variant options
 * @example
 * {
 *	"color": "8",
 *	"size": "6"
 * }
 * @param {Array} variants all possible variants, array of {Objects}, each object has a values key.
 * The values in this key will have the same shape / data as the above formValues if they match
 * @return {Object} returns the variant object matching the selected form values
 */
const getProductFromFormValues = (formValues, variants) => {
    return variants ? variants.find(({values}) => {
        return Object.keys(formValues).every((key) => formValues[key] === values[key])
    }) : null
}

export const submitCartForm = (formValues) => (dispatch, getStore) => {
    const {productId, qty, variationCategories, variants} = submitCartFormSelector(getStore())
    const path = window.location.pathname
    const itemIdMatch = path.match(/\/id\/(.*?)\/product_id\//)

    if (variationCategories) {
        const errors = {}
        variationCategories.forEach(({name, label}) => {
            if (!formValues[name]) {
                errors[name] = `Please select a ${label}`
            }
        })
        if (Object.keys(errors).length > 0) {
            return Promise.reject(new SubmissionError({
                _error: errors
            }))
        }
    }

    dispatch(addToCartStarted())
    const variant = getProductFromFormValues(formValues, variants)

    return dispatch(itemIdMatch ? updateCartItem(itemIdMatch[1], qty, productId, variant) : addToCart(productId, qty, variant))
        .then(() => {
            dispatch(setIsWishlistAdded(false))
            return dispatch(openModal(PRODUCT_DETAILS_ITEM_ADDED_MODAL, UI_NAME.addToCart))
        })
        .catch((error) => {
            console.error('Error adding to cart', error)
            return dispatch(addNotification(
                'addToCartError',
                'Unable to add item to the cart.',
                true
            ))
        })
        .then(() => dispatch(addToCartComplete()))
}

const variationChangeSelector = createPropsSelector({
    variationSelections: getAddToCartFormValues,
    categoryIds: getProductVariationCategoryIds,
    variants: getProductVariants
})

export const onVariationChange = () => (dispatch, getStore) => {
    const {
        variationSelections,
        categoryIds,
        variants
    } = variationChangeSelector(getStore())

    return dispatch(getProductVariantData(variationSelections, variants, categoryIds))
}


const addToWishlistSelector = createPropsSelector({
    productID: getCurrentProductId,
    isLoggedIn: getIsLoggedIn,
    signInURL: getSignInURL
})

export const addToWishlist = (quantity) => (dispatch, getState) => {
    const {productID, isLoggedIn, signInURL} = addToWishlistSelector(getState())
    // check if user is logged in
    // add loading state to wishlist btn
    if (!isLoggedIn) {
        browserHistory.push({
            pathname: signInURL
        })
        return Promise.resolve()
    }

    return dispatch(addItemToWishlist(productID, window.location.href, quantity))
        .then(() => {
            dispatch(setIsWishlistAdded(true))
            return dispatch(openModal(PRODUCT_DETAILS_ITEM_ADDED_MODAL, UI_NAME.wishlist))
        })
        .catch((error) => {
            if (/Failed to fetch|Add Request Failed|Unable to add item/i.test(error.message)) {
                dispatch(addNotification(
                    'cartWishlistError',
                    'Unable to add item to wishlist.',
                    true
                ))
            } else {
                throw error
            }
        })
}

export const updateItemInWishlist = (quantity) => (dispatch, getState) => {
    const itemId = window.location.pathname.match(/\/id\/(\w+)\//)[1]
    const wishlistId = getWishlistID(getState())

    return dispatch(updateWishlistItem(itemId, wishlistId, quantity))
        .then(() => {
            dispatch(setIsWishlistAdded(true))
            return dispatch(openModal(PRODUCT_DETAILS_ITEM_ADDED_MODAL, UI_NAME.wishlist))
        })
}
