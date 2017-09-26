/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import Immutable from 'immutable'
import {createSelector} from 'reselect'
import {createGetSelector, createHasSelector} from 'reselect-immutable-helpers'
import {getUi, getCategories} from '../../store/selectors'
import {getCategoryProducts} from '../../store/categories/selectors'
import {getCurrentPathKey, getCurrentPathKeyWithoutQuery} from 'progressive-web-sdk/dist/store/app/selectors'
import {sortLib} from '../../utils/sort-utils'

export const getProductList = createSelector(getUi, ({productList}) => productList)

export const getCurrentProductList = createGetSelector(
    getProductList,
    getCurrentPathKey,
    Immutable.Map()
)

export const getCurrentSort = createGetSelector(getCurrentProductList, 'sort')

export const getProductListInfoLoaded = createHasSelector(
    getCategories,
    getCurrentPathKeyWithoutQuery
)

export const getProductListContentsLoaded = createHasSelector(
    getCategories,
    getCurrentPathKey
)

export const getSortOptions = createGetSelector(getCategories, 'sortOptions', Immutable.Map())
export const getCategorySortOptions = createGetSelector(
    getSortOptions,
    getCurrentPathKeyWithoutQuery,
    Immutable.List()
)

export const getFilterOptions = createGetSelector(getCategories, 'filterOptions', Immutable.Map())
export const getCategoryFilterOptions = createGetSelector(
    getFilterOptions,
    getCurrentPathKeyWithoutQuery,
    Immutable.List()
)
export const getActiveFilters = createSelector(
    getCategoryFilterOptions,
    (filters) => (
        filters.reduce((activeFilters, filter) => activeFilters.concat(
            filter.get('kinds').filter((kind) => kind.get('active'))
        ), Immutable.List())
    )
)

export const getSortedListProducts = createSelector(
    getCategoryProducts,
    getCurrentSort,
    (products, sort) => {
        return sort ? products.sort(sortLib[sort]) : products
    }
)
