/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import template from '../../template'

import ListTile from 'progressive-web-sdk/dist/components/list-tile'
import List from 'progressive-web-sdk/dist/components/list'
import Icon from 'progressive-web-sdk/dist/components/icon'
import {createPropsSelector} from 'reselect-immutable-helpers'

import {
    getAccountAddressURL,
    getAccountInfoURL,
    getAccountOrderListURL,
    getWishlistURL
} from '../app/selectors'

const DashboardLinks = ({link: {text, href}}) => {
    return (
        <ListTile
            className="t-account-dashboard__link"
            href={href}
            endAction={<Icon name="chevron-right" />}
        >
            <div>{text}</div>
        </ListTile>
    )
}

DashboardLinks.propTypes = {
    link: PropTypes.shape({
        href: PropTypes.string,
        text: PropTypes.string
    })
}


const AccountDashboard = ({addressUrl, accountInfoUrl, wishlistUrl, orderListUrl}) => {
    const links = [
        {
            text: 'Account Information',
            href: accountInfoUrl
        },
        {
            text: 'Address Book',
            href: addressUrl
        },
        {
            text: 'My Orders',
            href: orderListUrl
        },
        {
            text: 'My Wish List',
            href: wishlistUrl
        },
        {
            text: 'My Subscriptions',
            href: '/newsletter/manage/'
        }
    ]

    return (
        <div className="t-account-dashboard">
            <h1 className="t-account-dashboard__title u-padding-md u-text-uppercase">My Dashboard</h1>
            <List className="u-bg-color-neutral-00 u-border-bottom u-border-top">
                {links.map((link, idx) => <DashboardLinks link={link} key={idx} />)}
            </List>
        </div>
    )
}

AccountDashboard.propTypes = {
    accountInfoUrl: PropTypes.string,
    addressUrl: PropTypes.string,
    orderListUrl: PropTypes.string,
    wishlistUrl: PropTypes.string
}
const mapStateToProps = createPropsSelector({
    addressUrl: getAccountAddressURL,
    accountInfoUrl: getAccountInfoURL,
    orderListUrl: getAccountOrderListURL,
    wishlistUrl: getWishlistURL
})

export default template(connect(
    mapStateToProps
)(AccountDashboard))
