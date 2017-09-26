/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {closeModal} from 'progressive-web-sdk/dist/store/modals/actions'
import {splitFullName} from '../../utils/utils'
import {addAddress, deleteAddress, editAddress} from 'progressive-web-sdk/dist/integration-manager/account/commands'
import {ACCOUNT_ADDRESS_MODAL} from '../../modals/constants'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
export const setAddressID = createAction('Set Address ID', ['addressID'])
export const setIsEditing = createAction('Set isEdit', ['isEdit'])

export const submitAddAddress = (formValues) => (dispatch) => {
    const {firstname, lastname} = splitFullName(formValues.name)
    // Merlin's connector doens't support address names,
    // and SFCC requires an address name.
    // Since we're not showing the addressName field, we need
    // to manually assign an addressName for SFCC to accept the address.
    // Merlin's connector will ignore this value.
    const addressName = Math.random().toString(36).slice(2) // eslint-disable-line

    return dispatch(addAddress({...formValues, firstname, lastname, addressName}))
        .then(() => dispatch(closeModal(ACCOUNT_ADDRESS_MODAL, UI_NAME.addNewAddress)))
}

export const submitEditAddress = (formValues) => (dispatch) => {
    const {firstname, lastname} = splitFullName(formValues.name)

    return dispatch(editAddress({...formValues, firstname, lastname}, formValues.id))
        .then(() => dispatch(closeModal(ACCOUNT_ADDRESS_MODAL, UI_NAME.editSavedAddress)))
}

export const removeAddress = (id) => (dispatch) => {
    return dispatch(deleteAddress(id))
}
