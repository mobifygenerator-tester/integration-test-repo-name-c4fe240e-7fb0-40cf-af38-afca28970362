/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
import {receiveNavigationData} from 'progressive-web-sdk/dist/integration-manager/results'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'
import {setNavigationPath} from './actions'

const CATEGORY_PLACEHOLDER_COUNT = 6
const INITIAL_ROOT = new Array(CATEGORY_PLACEHOLDER_COUNT).fill({
    isCategoryLink: true
})

// Insert blank object at start to act as placeholder for "sign in"
INITIAL_ROOT.push({})

export const initialState = Immutable.fromJS({
    path: undefined,
    root: {
        children: INITIAL_ROOT,
    },
})

export const reducer = handleActions({
    [receiveNavigationData]: mergePayload,
    [setNavigationPath]: mergePayload
}, initialState)

export default reducer
