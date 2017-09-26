/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'
import {receiveWishlistUIData} from 'progressive-web-sdk/dist/integration-manager/account/results'
import {receiveWishlistItemQuantity, setRemoveWishlistItemData} from './actions'

const initialState = Immutable.Map()

export default handleActions({
    [receiveWishlistUIData]: mergePayload,
    [receiveWishlistItemQuantity]: mergePayload,
    [setRemoveWishlistItemData]: mergePayload
}, initialState)
