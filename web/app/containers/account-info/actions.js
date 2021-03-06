/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {validateFullName} from '../../utils/utils'
import {updateAccountInfo, updateAccountPassword} from 'progressive-web-sdk/dist/integration-manager/account/commands'
import {addNotification} from 'progressive-web-sdk/dist/store/notifications/actions'
import {SubmissionError} from 'redux-form'

export const submitAccountInfoForm = (formValues) => (dispatch) => {
    const {currentPassword, newPassword, names, email} = formValues
    const errors = {}

    if (!validateFullName(names)) {
        errors.names = 'Enter a valid full name'
    }

    if (!email) {
        errors.email = 'Please enter an email'
    }


    if (currentPassword && !newPassword) {
        errors.newPassword = 'Please enter a new password'
    }

    if (!currentPassword && newPassword) {
        errors.currentPassword = 'Please enter your current password'
    }


    if (Object.keys(errors).length) {
        return Promise.reject(new SubmissionError(errors))
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
        return Promise.reject(new SubmissionError({
            newPassword: 'Enter a different new password'
        }))
    }

    return dispatch(updateAccountInfo(formValues))
        .then(() => {
            if (formValues.currentPassword && formValues.newPassword) {
                return dispatch(updateAccountPassword(formValues))
            }
            return Promise.resolve()
        })
        .then(() => dispatch(addNotification(
                'accountInfoUpdated',
                'Successfully updated account information',
                true
            )))
        .catch(({errors}) => {
            dispatch(addNotification(
                'accountInfoError',
                errors._error,
                true
            ))
        })
}
