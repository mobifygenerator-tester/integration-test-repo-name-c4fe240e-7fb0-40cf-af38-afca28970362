/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createSelector} from 'reselect'
import {getUser} from 'progressive-web-sdk/dist/store/user/selectors'

export const getAccountInfoInitialValues = createSelector(getUser, (user) => {
    return user.get('names') ? {
        names: user.get('names'),
        email: user.get('email')
    } : null
})
