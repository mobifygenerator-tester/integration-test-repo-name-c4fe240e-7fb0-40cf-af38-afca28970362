/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import classNames from 'classnames'

/**
 * Card component is used to show content in a card with header and footer
 */

const Card = ({
    className,
    header,
    children,
    footer,
    hasShadow,
    hasBorder,
    headerClassName,
    innerClassName
}) => {
    const classes = classNames('c-card', {
        'c--shadow': hasShadow,
        'c--border': hasBorder,
    }, className)

    const headerClasses = classNames('c-card__header', headerClassName)

    const innerClasses = classNames('c-card__inner', innerClassName)

    return (
        <article className={classes}>
            <div className={innerClasses}>
                {header &&
                    <header className={headerClasses}>
                        {header}
                    </header>
                }
                <div className="c-card__content">
                    {children}
                </div>

                {footer &&
                    <footer className="c-card__footer">
                        {footer}
                    </footer>
                }
            </div>
        </article>
    )
}


Card.propTypes = {
    /**
     * Main content of the card
     */
    children: PropTypes.node,

    /**
     * Adds values to the `class` attribute of the root element
     */
    className: PropTypes.string,

    /**
     * Footer content of the card
     */
    footer: PropTypes.node,

    /**
     * Determines if card has border
     */
    hasBorder: PropTypes.bool,

    /**
     * Determines if card has box-shadow
     */
    hasShadow: PropTypes.bool,

    /**
     * Header content of the card
     */
    header: PropTypes.node,
    /**
     * Classes to add to the header
     */
    headerClassName: PropTypes.string,
    /**
     * Classes to add to the inner container of the component
     */
    innerClassName: PropTypes.string
}

export default Card
