/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {
    addToCartFromWishlist as addToCartFromWishlistCommand,
    updateWishlistItemQuantity as updateWishlistQuantityCommand,
    removeItemFromWishlist
} from 'progressive-web-sdk/dist/integration-manager/account/commands'
import {addNotification} from 'progressive-web-sdk/dist/store/notifications/actions'
import {WISHLIST_ITEM_ADDED_MODAL} from '../../modals/constants'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {openModal, closeModal} from 'progressive-web-sdk/dist/store/modals/actions'
import * as appActions from '../app/actions'
import {receiveCurrentProductId} from 'progressive-web-sdk/dist/integration-manager/results'
import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {getWishlistID} from 'progressive-web-sdk/dist/store/user/selectors'
import {browserHistory} from 'progressive-web-sdk/dist/routing'

export const receiveWishlistItemQuantity = createAction('Receive Wishlist Item Quantity', ['itemQuantity'])
export const isConfiguringWishlist = createAction('User is configuring a wishlist item', ['isConfiguringWishlist'])
export const setRemoveWishlistItemData = createAction('User opened modal to remove wishlist item', ['removeWishlistItemData'])

export const addToCartFromWishlist = (productId, quantity, itemId) => (dispatch, getState) => {
    const wishlistId = getWishlistID(getState())
    dispatch(receiveCurrentProductId(productId))
    dispatch(receiveWishlistItemQuantity(quantity))

    return dispatch(addToCartFromWishlistCommand(productId, {quantity, wishlistId, itemId}))
        .then(() => dispatch(openModal(WISHLIST_ITEM_ADDED_MODAL, UI_NAME.wishlist)))
        .catch(({message}) => {
            if (message && /redirect/i.test(message)) {
                return
            }
            dispatch(addNotification(
                'addToCartWishlistError',
                'Unable to add item to the cart.',
                true
            ))
        })
}

export const editWishlistItem = (productId, itemId) => (dispatch) => {
    dispatch(isConfiguringWishlist())
    return browserHistory.push({
        pathname: `/wishlist/index/configure/id/${itemId}/product_id/${productId}/`
    })
}

export const goToCheckout = () => (dispatch) => {
    dispatch(closeModal(WISHLIST_ITEM_ADDED_MODAL, UI_NAME.wishlist))
    dispatch(appActions.goToCheckout())
}

export const removeWishlistItem = (productId, itemId) => (dispatch, getState) => {
    const wishlistId = getWishlistID(getState())
    return dispatch(removeItemFromWishlist(itemId, wishlistId, productId))
}

export const updateWishlistQuantity = (quantity, itemId) => (dispatch, getState) => {
    const wishlistId = getWishlistID(getState())
    return dispatch(updateWishlistQuantityCommand(quantity, itemId, wishlistId))
}
