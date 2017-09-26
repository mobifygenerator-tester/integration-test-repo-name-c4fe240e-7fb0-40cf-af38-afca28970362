/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import Breadcrumbs from 'progressive-web-sdk/dist/components/breadcrumbs'
import {getWishlistItemCount, getWishlistTitle} from 'progressive-web-sdk/dist/store/user/selectors'
import {getAccountURL} from '../../app/selectors'


const WishlistHeader = ({
    dashboardURL,
    itemCount,
    title
}) => (
    <div className="u-padding-top-lg u-padding-bottom-lg u-padding-start-md u-padding-end-md u-border-light-bottom">
        <div>
            <Breadcrumbs items={[{text: 'Back to Dashboard', href: dashboardURL}]} />
        </div>
        <div className="u-margin-top-md">
            <h1 className="t-wishlist__title u-text-uppercase">{title} ({itemCount} Items)</h1>
        </div>
    </div>
)


WishlistHeader.propTypes = {
    dashboardURL: PropTypes.string,
    itemCount: PropTypes.number,
    title: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    dashboardURL: getAccountURL,
    itemCount: getWishlistItemCount,
    title: getWishlistTitle,
})

export default connect(
    mapStateToProps
)(WishlistHeader)
