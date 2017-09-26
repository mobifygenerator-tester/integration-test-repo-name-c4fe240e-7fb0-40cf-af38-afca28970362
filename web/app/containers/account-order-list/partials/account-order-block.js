/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'

import SkeletonText from 'progressive-web-sdk/dist/components/skeleton-text'

const OrderBlock = ({
    date,
    total,
    shippingAddress,
    status,
}) => (
    <div className="u-padding-md">
        <dl className="u-margin-0">
            <div className="u-flexbox">
                <dt className="u-flex u-margin-0 u-text-weight-regular u-color-neutral-50">Date</dt>
                {date ?
                    <dd className="u-flex">{date}</dd>
                :
                    <SkeletonText className="u-flex" width="40%" style={{lineHeight: '20px', display: 'block'}} />
                }
            </div>
            <div className="u-flexbox">
                <dt className="u-flex u-margin-0 u-text-weight-regular u-color-neutral-50">Ship to</dt>
                {shippingAddress ?
                    <dd className="u-flex">{shippingAddress.fullName}</dd>
                :
                    <SkeletonText className="u-flex" width="50%" style={{lineHeight: '20px', display: 'block'}} />
                }
            </div>
            <div className="u-flexbox">
                <dt className="u-flex u-margin-0 u-text-weight-regular u-color-neutral-50">Order total</dt>
                {total ?
                    <dd className="u-flex">{total}</dd>
                :
                    <SkeletonText className="u-flex" width="30%" style={{lineHeight: '20px', display: 'block'}} />
                }
            </div>
            <div className="u-flexbox">
                <dt className="u-flex u-margin-0 u-text-weight-regular u-color-neutral-50">Status</dt>
                {status ?
                    <dd className="u-flex">{status}</dd>
                :
                    <SkeletonText className="u-flex" width="40%" style={{lineHeight: '20px', display: 'block'}} />
                }
            </div>
        </dl>
    </div>
)

OrderBlock.propTypes = {
    date: PropTypes.string,
    shippingAddress: PropTypes.object,
    status: PropTypes.string,
    total: PropTypes.string
}

export default OrderBlock
