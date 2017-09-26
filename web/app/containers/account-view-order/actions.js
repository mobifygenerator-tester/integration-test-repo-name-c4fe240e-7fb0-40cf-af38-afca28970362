/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {reorderPreviousOrder} from 'progressive-web-sdk/dist/integration-manager/account/commands'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {getCurrentOrderId} from 'progressive-web-sdk/dist/store/user/orders/selectors'

export const reorderItem = () => (dispatch, getState) => {
    return dispatch(reorderPreviousOrder(getCurrentOrderId(getState())))
        .then((url) => {
            browserHistory.push({
                pathname: url
            })
        })
}
