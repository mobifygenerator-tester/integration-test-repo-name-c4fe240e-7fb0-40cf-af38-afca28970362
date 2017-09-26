/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import {
    ACCOUNT_NAV_ITEM,
    SIGNED_OUT_ACCOUNT_NAV_ITEM,
    GUEST_NAV,
    LOGGED_IN_NAV
} from '../../../modals/navigation/constants'

import {
    MY_ACCOUNT_URL,
    WISHLIST_URL,
    SIGN_IN_URL
} from '../config'


export const parseNavigation = ($, $content, isLoggedIn) => {
    const root = {title: 'Root', path: '/', children: []}

    const $navListItems = $content.find('#store\\.menu nav.navigation li')
    let path = root.path
    $navListItems.each((idx, item) => {
        const $item = $(item)
        const $link = ($item
            .find('a')
            .first()
        )
        root.children.push({
            title: $link.text().trim(),
            path: $link.attr('href'),
            isCategoryLink: true
        })
        if ($item.hasClass('active')) {
            path = $link.attr('href')
        }
    })

    root.children = root.children.concat(
        [
            {
                type: isLoggedIn ? ACCOUNT_NAV_ITEM : SIGNED_OUT_ACCOUNT_NAV_ITEM,
                title: 'My Account',
                options: {
                    icon: 'user',
                    className: 'u-margin-top-md u-border-top'
                },
                path: MY_ACCOUNT_URL
            },
            {
                type: isLoggedIn ? ACCOUNT_NAV_ITEM : SIGNED_OUT_ACCOUNT_NAV_ITEM,
                title: 'Wishlist',
                options: {
                    icon: 'star'
                },
                path: WISHLIST_URL
            },
            {
                ...(isLoggedIn ? LOGGED_IN_NAV : GUEST_NAV),
                options: {
                    icon: isLoggedIn ? 'lock' : 'user',
                    className: !isLoggedIn ? 'u-margin-top-md u-border-top' : ''
                },
                path: SIGN_IN_URL
            }
        ])

    return {root, path}
}
