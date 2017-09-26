/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {Ledger, LedgerRow} from 'progressive-web-sdk/dist/components/ledger'

import {
    getOrderTotal,
    getOrderTax,
    getOrderShippingTotal,
    getOrderSubtotal
} from 'progressive-web-sdk/dist/store/user/orders/selectors'

const OrderTotals = ({
    subtotal,
    shipping,
    tax,
    total
}) => (
    <div className="u-padding-md">
        <Ledger>

            <LedgerRow
                className="u-border-0"
                label="Subtotal"
                value={subtotal}
            />
            <LedgerRow
                className="u-border-0"
                label="Shipping & Handling"
                value={shipping}
            />
            <LedgerRow
                className="u-border-0"
                label="Tax"
                value={tax}

            />
            <LedgerRow
                className="u-border-0 u-text-size-big u-text-weight-bold"
                label="Total"
                value={total}
            />
        </Ledger>
    </div>
)


OrderTotals.propTypes = {
    shipping: PropTypes.string,
    subtotal: PropTypes.string,
    tax: PropTypes.string,
    total: PropTypes.string
}

const mapStateToProps = createPropsSelector({
    subtotal: getOrderSubtotal,
    shipping: getOrderShippingTotal,
    tax: getOrderTax,
    total: getOrderTotal
})

export default connect(
    mapStateToProps
)(OrderTotals)
