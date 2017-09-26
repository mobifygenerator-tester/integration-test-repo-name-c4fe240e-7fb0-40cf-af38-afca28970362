/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {handleActions} from 'redux-actions'
import Immutable from 'immutable'
import {mergePayload} from 'progressive-web-sdk/dist/utils/reducer-utils'
import * as accountActions from './actions'
import {receiveAccountDashboardUIData} from 'progressive-web-sdk/dist/integration-manager/account/results.js'

const initialState = Immutable.Map()

export default handleActions({
    [accountActions.changeTitle]: mergePayload,
    [receiveAccountDashboardUIData]: mergePayload,
}, initialState)
