/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import template from '../../template'
import WishlistContents from './partials/wishlist-contents'
import WishlistHeader from './partials/wishlist-header'

const Wishlist = () => (
    <div className="t-wishlist">
        <WishlistHeader />
        <WishlistContents />
    </div>
)

Wishlist.propTypes = {
    itemCount: PropTypes.number,
    title: PropTypes.string
}


export default template(Wishlist)
