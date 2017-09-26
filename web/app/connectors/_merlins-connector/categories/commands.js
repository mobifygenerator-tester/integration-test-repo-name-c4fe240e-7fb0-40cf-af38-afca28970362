/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {urlToPathKey, urlToBasicPathKey} from 'progressive-web-sdk/dist/utils/utils'
import categoryProductsParser, {parseCategoryTitle, parseCategoryId, filterParser, parseSortOptions, hasFilter} from './parser'
import {
    receiveCategoryContents,
    receiveCategoryInformation,
    receiveCategorySortOptions,
    receiveCategoryFilterOptions
} from 'progressive-web-sdk/dist/integration-manager/categories/results'
import {receiveProductListProductData} from 'progressive-web-sdk/dist/integration-manager/products/results'
import {changeFilterTo} from '../../../store/categories/actions'
import {productListParser} from '../products/parsers'
import {getTextFrom} from '../../../utils/parser-utils'
import {fetchPageData} from '../app/commands'

const extractFilter = (url) => {
    const filter = url.match(/filters=([^&|#]*)/)
    return filter ? filter[1] : ''
}

export const initProductListPage = (url) => (dispatch) => {
    const filter = decodeURIComponent(extractFilter(url))
    // Merlins uses 'product_list_order' as URL search key
    const rawURL = url
    url = url.replace('sort', 'product_list_order')
    url = decodeURIComponent(url.replace('filters=', ''))

    return dispatch(fetchPageData(url))
        .then((res) => {
            const [$, $response] = res
            const pathKey = urlToPathKey(rawURL)
            const pathKeyWithoutQuery = urlToBasicPathKey(pathKey)

            const title = parseCategoryTitle($, $response)
            const searchTermMatch = title.match(/'(.*)'/)
            const sortOptions = parseSortOptions($, $response)

            if (sortOptions.length > 0) {
                dispatch(receiveCategorySortOptions(pathKeyWithoutQuery, sortOptions))
            }
            if (!hasFilter($, $response)) {
                dispatch(receiveCategoryFilterOptions(pathKeyWithoutQuery, filterParser($, $response)))
            } else {
                dispatch(changeFilterTo(filter))
            }

            // Receive page contents
            dispatch(receiveProductListProductData(productListParser($, $response)))
            dispatch(receiveCategoryInformation(pathKeyWithoutQuery, {
                id: parseCategoryId($, $response) || pathKey,
                href: pathKeyWithoutQuery,
                parentId: null,
                title,
                searchTerm: searchTermMatch ? searchTermMatch[0] : null,
                description: getTextFrom($response, '#text, .category-description')
            }))
            dispatch(receiveCategoryContents(pathKey, categoryProductsParser($, $response)))
        })
}
