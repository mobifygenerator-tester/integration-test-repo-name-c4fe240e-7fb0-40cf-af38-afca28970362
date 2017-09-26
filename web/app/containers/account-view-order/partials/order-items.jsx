/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import {createPropsSelector} from 'reselect-immutable-helpers'
import SkeletonBlock from 'progressive-web-sdk/dist/components/skeleton-block'
import Card from '../../../components/card'

import {getOrderItems} from 'progressive-web-sdk/dist/store/user/orders/selectors'

const OrderItems = ({
    items
}) => (
    <div className="">
        {items ?
            items.map(({itemName, price, quantity, options}) => (
                <Card header={itemName} key={itemName} className="u-border-bottom" headerClassName="u-padding-start u-padding-bottom" innerClassName="u-padding-md">
                    <div className="u-flexbox u-align-bottom">
                        <div className="u-flex u-text-height-small u-text-quiet u-padding-start u-padding-bottom">
                            {options &&
                                options.map((option) => (
                                    <p key={option.value}>
                                        {option.label}: {option.value}
                                    </p>
                                ))
                            }
                            <p>Ordered: {quantity}</p>
                        </div>
                        <div className="u-text-align-end u-flex u-text-weight-bold u-padding-end-md u-padding-bottom-lg">
                            {price}
                        </div>
                    </div>
                </Card>
            ))
        :
            <SkeletonBlock height="34px" />
        }
    </div>
)


OrderItems.propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({
        itemName: PropTypes.string,
        linePrice: PropTypes.string,
        itemPrice: PropTypes.string,
        quantity: PropTypes.string
    }))
}

const mapStateToProps = createPropsSelector({
    items: getOrderItems
})

export default connect(
    mapStateToProps
)(OrderItems)
