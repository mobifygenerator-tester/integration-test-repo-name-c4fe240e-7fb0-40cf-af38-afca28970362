/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */
/* Copyright (c) 2017 Mobify Research & Development Inc. All rights reserved. */
/* * *  *  * *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  * */

import React, {PropTypes} from 'react'
import {connect} from 'react-redux'
import * as ReduxForm from 'redux-form'
import {createPropsSelector} from 'reselect-immutable-helpers'
import {getProductVariationCategories} from 'progressive-web-sdk/dist/store/products/selectors'
import {onVariationChange} from '../actions'

import FieldRow from 'progressive-web-sdk/dist/components/field-row'
import {Swatch, SwatchItem} from 'progressive-web-sdk/dist/components/swatch'

const variationSwatch = ({input: {value, onChange}, values, label, error, name, onVariationChange}) => { // eslint-disable-line
    const handleChange = (val) => {
        onChange(value = val)
        onVariationChange()
    }

    return (
        <div>
            <Swatch
                label={label}
                onChange={handleChange}
                value={value}
                className={error && !value ? 'pw-swatch__error' : ''}
            >
                {values.map(({label, value}) =>
                    <SwatchItem key={value}
                        value={value}
                        analyticsName={name}
                        analyticsContent={label}
                    >
                        {label}
                    </SwatchItem>
                )}
                {error && !value &&
                    <div className="pw-swatch__error">{error[name]}</div>
                }
            </Swatch>
        </div>
    )
}

variationSwatch.propTypes = {
    input: PropTypes.shape({
        value: PropTypes.string,
        onChange: PropTypes.func
    }),
    label: PropTypes.string,
    values: PropTypes.array
}

const ProductDetailsVariations = ({variations, error, onVariationChange}) => (
    <div className={variations.length > 0 && 'u-margin-top-lg u-padding-start-md u-padding-end-md'}>
        {variations.map(({id, name, label, values = []}) => (
            <FieldRow key={id} error={error}>
                <ReduxForm.Field
                    label={label}
                    name={name}
                    values={values}
                    error={error}
                    component={variationSwatch}
                    onVariationChange={onVariationChange}
                />
            </FieldRow>
        ))}
    </div>
)

ProductDetailsVariations.propTypes = {
    error: PropTypes.object,
    variations: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string,
        label: PropTypes.string,
        values: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string,
            value: PropTypes.string
        }))
    })),
    onVariationChange: PropTypes.func
}

const mapStateToProps = createPropsSelector({
    variations: getProductVariationCategories
})

const mapDispatchToProps = {
    onVariationChange
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ProductDetailsVariations)
