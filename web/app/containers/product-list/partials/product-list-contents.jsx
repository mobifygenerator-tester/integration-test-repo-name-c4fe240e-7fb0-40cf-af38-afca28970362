/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import classNames from 'classnames'
import {browserHistory} from 'progressive-web-sdk/dist/routing'
import {getCategoryItemCount} from '../../../store/categories/selectors'
import * as selectors from '../selectors'
import {getAssetUrl} from 'progressive-web-sdk/dist/asset-utils'
import {validatePageNumber} from 'progressive-web-sdk/dist/utils/utils'
import {PRODUCT_LIST_FILTER_MODAL} from '../../../modals/constants'
import {openModal} from 'progressive-web-sdk/dist/store/modals/actions'
import {changeFilterTo} from '../../../store/categories/actions'
import {receiveCurrentProductId} from 'progressive-web-sdk/dist/integration-manager/results'

import Button from 'progressive-web-sdk/dist/components/button'
import List from 'progressive-web-sdk/dist/components/list'
import Image from 'progressive-web-sdk/dist/components/image'
import Pagination from 'progressive-web-sdk/dist/components/pagination'
import Field from 'progressive-web-sdk/dist/components/field'
import {UI_NAME} from 'progressive-web-sdk/dist/analytics/data-objects/'
import {ITEMS_PER_PAGE, DEFAULT_SORT_OPTION} from '../constants'

import ProductTile from '../../../components/product-tile'
import Card from '../../../components/card'

const noResultsText = 'We can\'t find products matching the selection'
const emptySearchText = 'Your search returned no results. Please check your spelling and try searching again.'

const ResultList = ({products, setCurrentProduct}) => (
    <List className="pw--borderless">
        {products.map((product, idx) => (
            <Card hasShadow key={product ? product.id : idx}>
                <ProductTile
                    onClick={product ? () => setCurrentProduct(product.id) : null}
                    {...product}
                />
            </Card>
        ))}
    </List>
)

ResultList.propTypes = {
    products: PropTypes.array,
    setCurrentProduct: PropTypes.func
}

const NoResultsList = ({routeName}) => (
    <div className="u-flexbox u-direction-column u-align-center">
        <Image
            className="u-flex-none"
            alt="Crystal Ball"
            width="122px"
            height="110px"
            src={getAssetUrl('static/img/global/no-results.png')}
        />

        <div className="t-product-list__no-results-text u-text-align-center">
            {routeName === 'searchResultPage' ? emptySearchText : noResultsText}
        </div>
    </div>
)

NoResultsList.propTypes = {
    routeName: PropTypes.string
}

const ProductListContents = ({
    activeFilters,
    clearFilters,
    contentsLoaded,
    numItems,
    products,
    openModal,
    setCurrentProduct,
    sortOptions,
    routeName
}) => {
    const location = browserHistory.getCurrentLocation()
    const pathname = location.pathname
    const selectedSortOption = location.query.sort ? location.query.sort : 'default'
    const pageCount = Math.ceil(numItems / ITEMS_PER_PAGE)
    const page = validatePageNumber(location.query.p, pageCount)
    const hasActiveFilters = activeFilters.length > 0

    const updateURL = (queryObject) => {
        const query = Object.assign({}, location.query, queryObject)
        // No query string for page 1
        if (query.p === 1) {
            delete query.p
        }

        // No query string for default sort option
        if (query.sort === DEFAULT_SORT_OPTION) {
            delete query.sort
        }

        browserHistory.push({pathname, query})
    }

    const clearFiltersURL = () => {
        clearFilters()
        const query = Object.assign({}, location.query)
        delete query.filters
        browserHistory.push({pathname, query})
    }

    const filtersClasses = classNames('u-flexbox u-align-center u-border-light-top t-product-list__active-filter-container')

    return (
        <div>
            <div className={filtersClasses}>
                {hasActiveFilters && [
                    <div key="ruleset" className="u-flex u-padding-start-md">
                        {activeFilters.map(({label, query, ruleset}) =>
                            <div className="t-product-list__active-filter" key={query}>
                                <strong>{ruleset}</strong>: {label}
                            </div>
                        )}
                    </div>,
                    <div key="clear" className="u-flex-none">
                        <Button
                            className="u-color-brand"
                            icon="trash"
                            onClick={clearFiltersURL}
                            data-analytics-name={UI_NAME.clearFilters}
                        >
                            Clear
                        </Button>
                    </div>
                ]}
            </div>

            <div className="t-product-list__container u-padding-end u-padding-bottom-lg u-padding-start">
                <div className="t-product-list__num-results u-padding-md u-padding-start-sm u-padding-end-sm">
                    {products.length > 0 &&
                        <div className="u-flexbox">
                            <div className="t-product-list__filter u-flex u-margin-end-md">
                                <Field
                                    idForLabel="filterButton"
                                    label={contentsLoaded ? `${numItems} Items` : `Loading...`}
                                >
                                    <Button
                                        className="pw--tertiary u-width-full u-text-uppercase"
                                        onClick={openModal}
                                        disabled={routeName === 'searchResultPage' || hasActiveFilters}
                                        id="filterButton"
                                        data-analytics-name={UI_NAME.showFilters}
                                    >
                                        Filter
                                    </Button>
                                </Field>
                            </div>

                            {sortOptions &&
                                <div className="t-product-list__sort u-flex">
                                    <Field
                                        className="pw--has-select"
                                        idForLabel="sort"
                                        label="Sort by"
                                    >
                                        <select
                                            className="u-color-neutral-60"
                                            value={selectedSortOption}
                                            onChange={(e) => { updateURL({sort: e.target.value}) }}
                                            onBlur={(e) => { updateURL({sort: e.target.value}) }}
                                            data-analytics-name={UI_NAME.sortBy}
                                        >
                                            {sortOptions.map((choice, index) =>
                                                <option key={index} value={choice.id}>{choice.label}</option>
                                            )}
                                        </select>
                                    </Field>
                                </div>
                            }
                        </div>
                    }
                </div>

                {(products.length > 0 || !contentsLoaded) ?
                    <ResultList products={products} setCurrentProduct={setCurrentProduct} />
                :
                    <NoResultsList routeName={routeName} />
                }
                {page && pageCount > 1 &&
                    <Pagination
                        className="u-margin-top-lg"
                        onChange={(newPage) => updateURL({p: newPage})}
                        currentPage={page ? page : 1}
                        pageCount={pageCount}
                        showCurrentPageMessage={true}
                        showPageButtons={false}
                    />
                }
            </div>
        </div>
    )
}

ProductListContents.propTypes = {
    products: PropTypes.array.isRequired,
    activeFilters: PropTypes.array,
    changePagination: PropTypes.func,
    clearFilters: PropTypes.func,
    contentsLoaded: PropTypes.bool,
    location: PropTypes.object,
    numItems: PropTypes.number,
    openModal: PropTypes.func,
    routeName: PropTypes.string,
    setCurrentProduct: PropTypes.func,
    sortOptions: PropTypes.array
}

const mapStateToProps = createPropsSelector({
    contentsLoaded: selectors.getProductListContentsLoaded,
    numItems: getCategoryItemCount,
    activeFilters: selectors.getActiveFilters,
    products: selectors.getSortedListProducts,
    sortOptions: selectors.getCategorySortOptions
})

const mapDispatchToProps = {
    clearFilters: () => changeFilterTo(null),
    openModal: () => openModal(PRODUCT_LIST_FILTER_MODAL, UI_NAME.filters),
    setCurrentProduct: receiveCurrentProductId
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductListContents)
