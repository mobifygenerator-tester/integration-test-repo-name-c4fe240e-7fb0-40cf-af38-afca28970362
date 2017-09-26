/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
import {createAction} from 'progressive-web-sdk/dist/utils/action-creation'
import {getCurrentPathKeyWithoutQuery} from 'progressive-web-sdk/dist/store/app/selectors'
import {getCategoryFilterOptions} from '../../containers/product-list/selectors'

export const changeFilter = createAction('Change Filter')

export const changeFilterTo = (searchKey) => (dispatch, getStore) => {
    const currentState = getStore()
    const filters = getCategoryFilterOptions(currentState).toJS()

    filters.forEach((filter) =>
        filter.kinds.forEach((kind) => {
            kind.active = kind.searchKey === searchKey
        })
    )

    const updatedFilter = {filterOptions: {[getCurrentPathKeyWithoutQuery(currentState)]: filters}}
    dispatch(changeFilter(updatedFilter))
}
