'use strict';

var React = require('react');
var PropTypes = require('prop-types');

module.exports = {

    propTypes: {
        layout: PropTypes.string,
        validatePristine: PropTypes.bool,
        validateOnSubmit: PropTypes.bool,
        rowClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ]),
        labelClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ]),
        elementWrapperClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ])
    },

    contextTypes: {
        layout: PropTypes.string,
        validatePristine: PropTypes.bool,
        validateOnSubmit: PropTypes.bool,
        rowClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ]),
        labelClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ]),
        elementWrapperClassName: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array,
            PropTypes.object
        ])
    },

    getDefaultProps: function() {
        return {
            disabled: false,
            validatePristine: false,
            validateOnSubmit: false,
            onChange: function() {},
            onFocus: function() {},
            onBlur: function() {}
        };
    },

    /**
     * Accessors for "special" properties.
     *
     * The following methods are used to merge master default properties that
     * are optionally set on the parent form. This to to allow customising these
     * properties 'as a whole' for the form, while retaining the ability to
     * override the properties on a component basis.
     *
     * Also see the parent-context mixin.
     */
    getLayout: function() {
        var defaultProperty = this.context.layout || 'horizontal';
        return this.props.layout ? this.props.layout : defaultProperty;
    },

    getValidatePristine: function() {
        var defaultProperty = this.context.validatePristine || false;
        return this.props.validatePristine ? this.props.validatePristine : defaultProperty;
    },

    getValidateOnSubmit: function() {
        var defaultProperty = this.context.validateOnSubmit || false;
        return this.props.validateOnSubmit ? this.props.validateOnSubmit : defaultProperty;
    },

    getRowClassName: function() {
        return [this.context.rowClassName, this.props.rowClassName];
    },

    getLabelClassName: function() {
        return [this.context.labelClassName, this.props.labelClassName];
    },

    getElementWrapperClassName: function() {
        return [this.context.elementWrapperClassName, this.props.elementWrapperClassName];
    },

    getRowProperties: function() {
        return {
            label: this.props.label,
            rowClassName: this.getRowClassName(),
            labelClassName: this.getLabelClassName(),
            elementWrapperClassName: this.getElementWrapperClassName(),
            layout: this.getLayout(),
            required: this.isRequired(),
            hasErrors: this.showErrors()
        };
    },

    hashString: function(string) {
        var hash = 0;
        for (var i = 0; i < string.length; i++) {
            hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
        }
        return hash;
    },

    /**
     * getId
     *
     * The ID is used as an attribute on the form control, and is used to allow
     * associating the label element with the form control.
     *
     * If we don't explicitly pass an `id` prop, we generate one based on the
     * `name` and `label` properties.
     */
    getId: function() {
        if (this.props.id) {
            return this.props.id;
        }
        var label = (typeof this.props.label === 'undefined' ? '' : this.props.label);
        return [
            'frc',
            this.props.name.split('[').join('_').replace(']', ''),
            this.hashString(JSON.stringify(label))
        ].join('-');
    },

    renderHelp: function() {
        if (!this.props.help) {
            return null;
        }
        return (
            <small className="form-text text-muted">{this.props.help}</small>
        );
    },

    renderErrorMessage: function() {
        if (!this.showErrors()) {
            return null;
        }
        var errorMessages = this.getErrorMessages() || [];
        return errorMessages.map((message, key) => {
            return (
                <div key={key} className="form-control-feedback">{message}</div>
            );
        });
    },

    showErrors: function() {
        if (this.isPristine() && !this.getValidatePristine()) {
            return false;
        }
        if (this.getValidateOnSubmit() && !this.isFormSubmitted()) {
            return false;
        }
        return !this.isValid();
    }
};
