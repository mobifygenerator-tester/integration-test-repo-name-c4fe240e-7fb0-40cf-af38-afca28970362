/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import classnames from 'classnames'
import Field from 'progressive-web-sdk/dist/components/field'

/**
 * Displays the price for an item
 * Accepts both the linePrice and itemPrice
 */

const ItemPrice = ({
    linePrice,
    itemPrice,
    className
}) => {
    const wrapperClass = classnames(className, 'c-item-price')
    return (
        <Field className={wrapperClass}>
            <div className="u-text-align-end u-flex">
                <div className="u-h5 u-color-accent u-text-weight-bold">{linePrice}</div>
                {itemPrice &&
                    <div className="u-text-quiet"><em>{itemPrice} each</em></div>
                }
            </div>
        </Field>
    )
}


ItemPrice.propTypes = {
    className: PropTypes.string,
    /**
     * The Unit price for the line item
     */
    itemPrice: PropTypes.string,
    /**
     * The full price for the line item (unit price * quantity)
    */
    linePrice: PropTypes.string
}

export default ItemPrice
