/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {reorderPreviousOrder} from 'progressive-web-sdk/dist/integration-manager/account/commands'
import {receiveCurrentOrderNumber} from 'progressive-web-sdk/dist/integration-manager/account/results'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {extractPathFromURL} from 'progressive-web-sdk/dist/utils/utils'
import {getAccountOrderListURL} from '../app/selectors'

export const receiveData = createAction('Receive AccountOrderList data')
export const setOrderListPage = createAction('Receive the paginated orderlist page', ['pageNumber'])

export const reorderItems = (orderId) => (dispatch) => {
    return dispatch(reorderPreviousOrder(orderId))
        .then((pathname) => browserHistory.push({pathname}))
}

export const navigateToOrder = (orderId, orderHref) => (dispatch, getState) => {

    dispatch(receiveCurrentOrderNumber(orderId))
    browserHistory.push({
        pathname: extractPathFromURL(orderHref || `${getAccountOrderListURL(getState())}?showOrder`)
    })
}
