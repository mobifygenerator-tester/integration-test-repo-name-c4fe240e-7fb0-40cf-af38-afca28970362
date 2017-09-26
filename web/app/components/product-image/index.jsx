/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import Image from 'progressive-web-sdk/dist/components/image'

/**
 * Product image with width and height preset for use on the
 * view wishlist or cart pages
 */

const ProductImage = ({src, alt, className}) => (
    <Image src={src} alt={alt} width="104px" height="104px" className={className} />
)

ProductImage.propTypes = {
    alt: PropTypes.string,
    className: PropTypes.string,
    src: PropTypes.string
}

export default ProductImage
