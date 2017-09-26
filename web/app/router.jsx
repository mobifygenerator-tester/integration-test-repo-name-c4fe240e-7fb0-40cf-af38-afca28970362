/* eslint-disable import/namespace */
/* eslint-disable import/named */
import React, {PropTypes} from 'react'
import {Router as SDKRouter, Route, IndexRoute} from 'progressive-web-sdk/dist/routing'
import {Provider} from 'react-redux'

import {setFetchedPage} from 'progressive-web-sdk/dist/store/offline/actions'

// Containers
import App from './containers/app/container'
// These templates are code-split out of the main bundle.
import {
    AccountDashboard,
    AccountAddress,
    AccountInfo,
    AccountOrderList,
    Cart,
    CheckoutConfirmation,
    CheckoutPayment,
    CheckoutShipping,
    Login,
    ProductList,
    ProductDetails,
    Wishlist,
    AccountViewOrder
} from './containers/templates'

// We build this into the app so we can load the home page right away
import Home from './containers/home/container'
import CheckoutHeader from './containers/checkout-header/container'
import CheckoutFooter from './containers/checkout-footer/container'

import {initHomePage} from 'progressive-web-sdk/dist/integration-manager/home/commands'
import {initCartPage} from 'progressive-web-sdk/dist/integration-manager/cart/commands'
import {initProductListPage} from 'progressive-web-sdk/dist/integration-manager/categories/commands'
import {initProductDetailsPage} from 'progressive-web-sdk/dist/integration-manager/products/commands'
import {
    initRegisterPage,
    initLoginPage,
    initAccountDashboardPage,
    initAccountAddressPage,
    initAccountInfoPage,
    initWishlistPage,
    initAccountViewOrderPage,
    initAccountOrderListPage
} from 'progressive-web-sdk/dist/integration-manager/account/commands'
import {initCheckoutConfirmationPage} from 'progressive-web-sdk/dist/integration-manager/checkout/commands'
import {initShippingPage} from './containers/checkout-shipping/actions'
import {initPaymentPage} from './containers/checkout-payment/actions'

import {checkIfOffline} from './containers/app/actions'
import {hasFetchedCurrentPath} from 'progressive-web-sdk/dist/store/offline/selectors'

import {getURL} from './utils/utils'
import {isRunningInAstro, pwaNavigate} from './utils/astro-integration'

import {onPageReady, trackPerformance} from 'progressive-web-sdk/dist/analytics/actions'
import {PERFORMANCE_METRICS} from 'progressive-web-sdk/dist/analytics/data-objects/'

// We define an initial OnChange as a no-op for non-Astro use
let OnChange = () => {}

if (isRunningInAstro) {
    // Redefine OnChange to enable Astro integration
    OnChange = (prevState, nextState, replace, callback) => {
        if (nextState.location.action === 'POP') {
            callback()
            return
        }

        pwaNavigate({url: getURL(nextState)}).then(() => {
            callback()
        })
    }
}

const initPage = (initAction) => (url, routeName) => (dispatch, getState) => {
    return dispatch(initAction(url, routeName))
        .then(() => {
            trackPerformance(PERFORMANCE_METRICS.isSavedPage, hasFetchedCurrentPath(getState()) ? 'true' : 'false')
            dispatch(setFetchedPage(url))
        })
        .then(() => {
            dispatch(onPageReady(routeName))
            trackPerformance(PERFORMANCE_METRICS.templateAPIEnd)
        })
        .catch((error) => console.error(`Error executing fetch action for ${routeName}`, error))
        .then(() => dispatch(checkIfOffline()))
}

const Router = ({store}) => (
    <Provider store={store}>
        <SDKRouter>
            <Route path="/" component={App} onChange={OnChange}>
                <IndexRoute component={Home} routeName="home" fetchAction={initPage(initHomePage)} />
                <Route component={Cart} path="checkout/cart/" routeName="cart" fetchAction={initPage(initCartPage)} />
                <Route component={Login} path="customer/account/login/" routeName="signin" fetchAction={initPage(initLoginPage)} />
                <Route component={Login} path="customer/account/create/" routeName="register" fetchAction={initPage(initRegisterPage)} />
                <Route component={AccountInfo} path="customer/account/edit/" routeName="accountInfo" fetchAction={initPage(initAccountInfoPage)} />
                <Route component={AccountDashboard} path="customer/account" routeName="account" fetchAction={initPage(initAccountDashboardPage)} />
                <Route component={AccountAddress} path="customer/address" routeName="accountAddress" fetchAction={initPage(initAccountAddressPage)} />
                <Route component={AccountOrderList} path="sales/order/history/" routeName="accountOrderList" fetchAction={initPage(initAccountOrderListPage)} />
                <Route component={ProductList} path="potions.html" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="books.html" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="ingredients.html" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="supplies.html" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="new-arrivals.html" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="charms.html" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="catalogsearch/result/" routeName="searchResultPage" fetchAction={initPage(initProductListPage)} />
                {/* Careful. The routeName on this 'configure' route is used to change how the ProductDetails component renders */}
                <Route component={ProductDetails} path="checkout/cart/configure/id/*/product_id/*/" routeName="cartEditPage" fetchAction={initPage(initProductDetailsPage)} />
                <Route component={ProductDetails} path="wishlist/index/configure/id/*/product_id/*/" routeName="wishlistEditPage" fetchAction={initPage(initProductDetailsPage)} />
                <Route component={ProductDetails} path="*.html" routeName="productDetailsPage" fetchAction={initPage(initProductDetailsPage)} />
                <Route component={Wishlist} path="wishlist/" routeName="wishlist" fetchAction={initPage(initWishlistPage)} />
                <Route component={AccountViewOrder} path="*/order/view/order_id/*/" routeName="accountViewOrder" fetchAction={initPage(initAccountViewOrderPage)} />
                <Route
                    component={CheckoutShipping}
                    path="checkout/"
                    routeName="checkout-shipping"
                    Header={CheckoutHeader}
                    Footer={CheckoutFooter}
                    headerHasSignIn
                    fetchAction={initPage(initShippingPage)}
                />
                {/*
                    The URL for the payment page on desktop is /checkout/#payment,
                    but routing wasn't working properly when using this as the
                    route path so we specify a fetchUrl to make sure when we
                    fetch it's using the URL for the desktop page
                */}
                <Route
                    component={CheckoutPayment}
                    path="checkout/payment/"
                    fetchUrl="/checkout/#payment"
                    routeName="checkout-payment"
                    Header={CheckoutHeader}
                    Footer={CheckoutFooter}
                    fetchAction={initPage(initPaymentPage)}
                />
                <Route
                    component={CheckoutConfirmation}
                    path="checkout/onepage/success/"
                    routeName="checkout-confirmation"
                    Header={CheckoutHeader}
                    Footer={CheckoutFooter}
                    fetchAction={initPage(initCheckoutConfirmationPage)}
                />

                {/* SFCC Connector routes */}
                <Route component={Home} path="*/Home-Show*" routeName="home" fetchAction={initPage(initHomePage)} />
                <Route component={ProductList} path="*/womens*" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="*/mens*" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="*/newarrivals*" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="*/electronics*" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="*/gift-certificates*" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="*/top-seller*" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={ProductList} path="*/Search-Show?*" routeName="productListPage" fetchAction={initPage(initProductListPage)} />
                <Route component={Wishlist} path="*/Wishlist-Show" routeName="wishlist" fetchAction={initPage(initWishlistPage)} />
                <Route
                    component={CheckoutShipping}
                    path="*/COShipping-Start*"
                    routeName="checkout-shipping"
                    Header={CheckoutHeader}
                    Footer={CheckoutFooter}
                    headerHasSignIn
                    fetchAction={initPage(initShippingPage)}
                />
                <Route
                    component={CheckoutPayment}
                    path="*/COBilling-Start*"
                    routeName="checkout-payment"
                    Header={CheckoutHeader}
                    Footer={CheckoutFooter}
                    fetchAction={initPage(initPaymentPage)}
                />

                <Route component={Login} path="*/Account-Show" routeName="signin" fetchAction={initPage(initLoginPage)} />
                <Route component={AccountInfo} path="*/Account-EditProfile" routeName="accountInfo" fetchAction={initPage(initAccountInfoPage)} />
                <Route component={AccountDashboard} path="*/Account-Show?dashboard" routeName="account" fetchAction={initPage(initAccountDashboardPage)} />
                <Route component={AccountAddress} path="*/Address-List" routeName="accountAddress" fetchAction={initPage(initAccountAddressPage)} />
                <Route component={AccountOrderList} path="*/Order-History" routeName="accountOrderList" fetchAction={initPage(initAccountOrderListPage)} />
                <Route component={AccountViewOrder} path="*/Order-History*?showOrder*" routeName="accountViewOrder" fetchAction={initPage(initAccountViewOrderPage)} />

                <Route component={Cart} path="*/Cart-Show*" routeName="cart" fetchAction={initPage(initCartPage)} />

                <Route
                    component={CheckoutConfirmation}
                    path="*/COSummary-Submit*"
                    routeName="checkout-confirmation"
                    Header={CheckoutHeader}
                    Footer={CheckoutFooter}
                    fetchAction={initPage(initCheckoutConfirmationPage)}
                />

            </Route>
        </SDKRouter>
    </Provider>
)

Router.propTypes = {
    store: PropTypes.object
}

export default Router
