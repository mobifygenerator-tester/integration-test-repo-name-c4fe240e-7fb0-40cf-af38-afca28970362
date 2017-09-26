/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import process from 'process'
import Home from '../page-objects/home'
import ProductList from '../page-objects/product-list'
import PushMessaging from '../page-objects/push-messaging'

let home
let productList
let pushMessaging

const PRODUCT_LIST_INDEX = process.env.PRODUCT_LIST_INDEX || 2
const ENV = process.env.NODE_ENV || 'test'

export default {
    '@tags': ['messaging'],

    before: (browser) => {
        home = new Home(browser)
        productList = new ProductList(browser)
        pushMessaging = new PushMessaging(browser)
        // Allow pushMessaging.assertSubscribed to run for 2 seconds
        browser.timeoutsAsyncScript(2000)
    },

    after: (browser) => {
        browser.end()
    },

    'Push Subscribe - Home': (browser) => {
        if (ENV === 'production') {
            browser.url(process.env.npm_package_siteUrl)
        } else {
            console.log('Running preview.')
            browser.preview(process.env.npm_package_siteUrl, 'https://localhost:8443/loader.js')
        }
        browser
            .waitForElementVisible(home.selectors.wrapper)
            .assert.visible(home.selectors.wrapper)
    },

    'Push Subscribe - Navigate and Accept Default Ask': (browser) => {
        home.navigateToProductList(PRODUCT_LIST_INDEX)
        browser.waitForElementVisible(productList.selectors.productDetailsItem(1))

        // This is the second page view, the DefaultAsk should be visible
        // by this point.
        pushMessaging
            .acceptDefaultAsk()
            .assertSubscribed()
    }
}
