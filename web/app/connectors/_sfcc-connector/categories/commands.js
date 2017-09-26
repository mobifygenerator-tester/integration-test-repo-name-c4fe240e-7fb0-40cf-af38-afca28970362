/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {urlToPathKey, urlToBasicPathKey, validatePageNumber} from 'progressive-web-sdk/dist/utils/utils'
import {makeApiRequest} from '../utils'
import {
    receiveCategoryContents,
    receiveCategoryInformation,
    receiveCategorySortOptions,
    receiveCategoryFilterOptions
} from 'progressive-web-sdk/dist/integration-manager/categories/results'
import {receiveProductListProductData} from 'progressive-web-sdk/dist/integration-manager/products/results'
import {parseProductListData, parseSortedProductKeys, parseFilterOptions} from '../parsers'
import {changeFilterTo} from '../../../store/categories/actions'
import {getCategoryPath, SEARCH_URL} from '../config'
import {makeQueryString} from '../../../utils/utils'
import {ITEMS_PER_PAGE, DEFAULT_SORT_OPTION} from '../../../containers/product-list/constants'

const REFINE_CATEGORY = 'refine_1=cgid'

const makeCategoryURL = (id) => `/categories/${id}`

const makeCategorySearchURL = (queries) => {
    let queryString = makeQueryString(queries)

    // mandatory keys
    if (!queries.q) {
        queryString += '&q='
    }

    if (!queries.start) {
        queryString += '&start=0'
    }

    return `/product_search${queryString}`
}

/* eslint-disable camelcase, no-use-before-define */
const processCategory = (dispatch) => ({parent_category_id, id, name}) => {
    const parentId = parent_category_id !== 'root' ? parent_category_id : null
    const path = urlToBasicPathKey(getCategoryPath(id))

    dispatch(receiveCategoryInformation(path, {
        id,
        title: name,
        href: path,
        parentId
    }))

    if (parentId) {
        dispatch(fetchCategoryInfo(parentId))
    }
}
/* eslint-enable camelcase, no-use-before-define */

const buildSearchTerm = (query) => query.replace(/\+/g, ' ').trim()

const fetchCategoryInfo = (id) => (dispatch) => {
    if (id) {
        return makeApiRequest(makeCategoryURL(id), {method: 'GET'})
            .then((response) => response.json())
            .then(processCategory(dispatch))
    }
    return Promise.resolve()
}

const extractCategoryId = (url) => {
    const pathKeyMatch = /\/([^/]+)$/.exec(url)
    const categoryIDMatch = pathKeyMatch ? pathKeyMatch[1].match(/([^?]*)|([^?]*)\?.*/) : ''
    return categoryIDMatch ? categoryIDMatch[1] : ''
}

const extractPageNumber = (url) => {
    const pageMatch = url.match(/p=([^&|#]*)/)
    return pageMatch ? pageMatch[1] : '1'
}

const extractSortOption = (url) => {
    const sortOption = url.match(/sort=([^&|#]*)/)
    return sortOption ? sortOption[1] : ''
}

const extractFilterOption = (url) => {
    const filterOption = url.match(/filters=([^&|#]*)/)
    return filterOption ? filterOption[1] : ''
}

export const initProductListPage = (url) => (dispatch) => {

    const path = urlToPathKey(url)
    const queries = {
        q: '',
        expand: 'availability,images,prices',
        [REFINE_CATEGORY]: extractCategoryId(url),
        start: ((validatePageNumber(extractPageNumber(url))) - 1) * ITEMS_PER_PAGE,
        count: ITEMS_PER_PAGE,
        sort: extractSortOption(url),
        refine_2: extractFilterOption(url) // support only one filter option now
    }

    const isSearch = path.includes(SEARCH_URL)

    if (isSearch) {
        const searchQueryMatch = path.match(/q=([^&|#]*)/)
        const searchQuery = searchQueryMatch ? searchQueryMatch[1] : ''
        const searchTerm = buildSearchTerm(searchQuery)

        queries.q = searchQuery

        dispatch(receiveCategoryInformation(path, {
            id: searchQuery,
            href: path,
            searchTerm,
            title: `Search results for ${searchTerm}`,
            parentId: null
        }))
    }

    const searchUrl = makeCategorySearchURL(queries)

    return dispatch(fetchCategoryInfo(isSearch ? null : queries[REFINE_CATEGORY]))
        .then(() => makeApiRequest(searchUrl, {method: 'GET'}))
        .then((response) => response.json())
        .then((response) => {
            const {total, hits, refinements, sorting_options, selected_refinements} = response

            const pathKeyWithoutQuery = urlToBasicPathKey(path)

            if (refinements) {
                dispatch(receiveCategoryFilterOptions(pathKeyWithoutQuery, parseFilterOptions(refinements)))
            }

            /* eslint-disable camelcase, no-use-before-define */
            if (selected_refinements) {
                // delete filter keys from query
                for (const key in selected_refinements) {
                    if (Object.prototype.hasOwnProperty.call(selected_refinements, key)) {
                        dispatch(changeFilterTo(`${key}=${selected_refinements[key]}`))
                    }
                }
            }

            /* eslint-disable camelcase, no-use-before-define */
            if (sorting_options) {
                sorting_options.unshift({id: DEFAULT_SORT_OPTION, label: 'Relevance'}) // default sorting option
                dispatch(receiveCategorySortOptions(pathKeyWithoutQuery, sorting_options))
            }

            if (total === 0) {
                dispatch(receiveCategoryContents(path, {
                    products: [],
                    itemCount: total
                }))
                return
            }

            const productListData = parseProductListData(hits)
            const sortedProductKeys = parseSortedProductKeys(hits)

            dispatch(receiveProductListProductData(productListData))
            dispatch(receiveCategoryContents(path, {
                products: sortedProductKeys,
                itemCount: total
            }))
        })
}
