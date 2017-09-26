/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

const selectors = {
    productDetailsTemplateIdentifier: '.t-product-details',
    addItem: '.t-product-details__add-to-cart:not([disabled])',
    itemAdded: '.m-product-details__item-added-modal',
    goToCheckout: '.m-product-details__item-added-modal .pw--primary'
}

const ProductDetails = function(browser) {
    this.browser = browser
    this.selectors = selectors
    this.inStock = true
}

ProductDetails.prototype.addItemToCart = function() {
    // Add an item to the cart
    const self = this
    this.browser
        .log('Adding item to cart')
        .element('css selector', selectors.addItem, (result) => {
            if (result.value && result.value.ELEMENT) {
                self.browser
                    .waitForElementVisible(selectors.addItem)
                    .click(selectors.addItem)
            } else {
                self.inStock = false
            }
        })
        .waitUntilMobified()
    return this
}

ProductDetails.prototype.navigateToCart = function() {
    // Navigate from ProductDetails to Checkout
    this.browser
        .log('Navigating to cart')
        .waitForElementVisible(selectors.goToCheckout)
        .click(selectors.goToCheckout)
        .waitUntilMobified()

    return this
}

export default ProductDetails
