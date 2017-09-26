/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import Breadcrumbs from 'progressive-web-sdk/dist/components/breadcrumbs'
import {getAccountOrderListURL} from '../../app/selectors'
import {getCurrentOrderNumber, getOrderDate, getOrderStatus} from 'progressive-web-sdk/dist/store/user/orders/selectors'
import SkeletonText from 'progressive-web-sdk/dist/components/skeleton-text'


const AccountViewOrderHeader = ({
    ordersURL,
    orderNumber,
    orderDate,
    orderStatus
}) => (
    <div className="u-padding-top-lg u-padding-bottom-lg u-padding-start-md u-padding-end-md">
        <div>
            <Breadcrumbs items={[{text: 'Back to Orders', href: ordersURL}]} />
        </div>
        <div className="u-margin-top-md u-margin-bottom-md">
            <h1 className="t-account-view-order__title">Order # {orderNumber ? orderNumber : <SkeletonText width="40%" style={{lineHeight: '32px'}} />}</h1>
        </div>


        <div className="u-flexbox">
            <dt className="u-flex u-margin-0 u-text-weight-regular u-color-neutral-50">Date</dt>
            {orderDate ?
                <dd className="u-flex">{orderDate}</dd>
            :
                <SkeletonText className="u-flex" width="40%" style={{lineHeight: '20px', display: 'block'}} />
            }
        </div>
        <div className="u-flexbox">
            <dt className="u-flex u-margin-0 u-text-weight-regular u-color-neutral-50">Status</dt>
            {orderStatus ?
                <dd className="u-flex">{orderStatus}</dd>
            :
                <SkeletonText className="u-flex" width="40%" style={{lineHeight: '20px', display: 'block'}} />
            }
        </div>
    </div>
)


AccountViewOrderHeader.propTypes = {
    orderDate: PropTypes.string,
    orderNumber: PropTypes.string,
    orderStatus: PropTypes.string,
    ordersURL: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    orderDate: getOrderDate,
    orderNumber: getCurrentOrderNumber,
    ordersURL: getAccountOrderListURL,
    orderStatus: getOrderStatus
})

export default connect(
    mapStateToProps
)(AccountViewOrderHeader)
