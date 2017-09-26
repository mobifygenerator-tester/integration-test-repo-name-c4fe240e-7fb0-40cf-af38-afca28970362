/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import Stepper from 'progressive-web-sdk/dist/components/stepper'
import Field from 'progressive-web-sdk/dist/components/field'

/**
 * A quantity stepper for products
 */

const ItemQuantityStepper = ({
    cartItemId,
    quantity,
    changeQuantity,
    className
}) => {
    return (
        <Field label="Quantity" idFor={`quantity-${cartItemId}`} className={className}>
            <Stepper
                className="pw--simple t-cart__product-stepper"
                idForLabel={`quantity-${cartItemId}`}
                incrementIcon="plus"
                decrementIcon="minus"
                initialValue={quantity}
                minimumValue={1}
                onChange={changeQuantity}
                />
        </Field>
    )
}


ItemQuantityStepper.propTypes = {
    /**
     * The id for the item associated with the stepper
     */
    cartItemId: PropTypes.string,
    /**
     * A callback function that will update the quantity for the item
     */
    changeQuantity: PropTypes.func,
    /**
     * Additional classes to apply to the component
     */
    className: PropTypes.string,
    /**
     * The current quantity of the item
     */
    quantity: PropTypes.number

}

export default ItemQuantityStepper
