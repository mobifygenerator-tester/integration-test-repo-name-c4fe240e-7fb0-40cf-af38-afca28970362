/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createSelector} from 'reselect'
import {createGetSelector} from 'reselect-immutable-helpers'
import {getUi} from '../../store/selectors'

export const getWishlist = createSelector(
    getUi,
    ({wishlist}) => wishlist
)

export const getContentLoaded = createGetSelector(getWishlist, 'contentLoaded', false)

export const getWishlistItemQuantity = createGetSelector(getWishlist, 'itemQuantity')

export const getRemoveWishlistItemData = createGetSelector(getWishlist, 'removeWishlistItemData')
