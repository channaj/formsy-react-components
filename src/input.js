/*jshint node:true */

'use strict';

var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var Formsy = require('formsy-react');
var ComponentMixin = require('./mixins/component');
var Row = require('./row');
var propUtilities = require('./prop-utilities');

var Input = createReactClass({

    mixins: [Formsy.Mixin, ComponentMixin],

    propTypes: {
        type: PropTypes.oneOf([
            'color',
            'date',
            'datetime',
            'datetime-local',
            'email',
            'hidden',
            'month',
            'number',
            'password',
            'range',
            'search',
            'tel',
            'text',
            'time',
            'url',
            'week'
        ]),
        addonBefore: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]),
        addonAfter: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node
        ]),
        buttonBefore: PropTypes.node,
        buttonAfter: PropTypes.node
    },

    getDefaultProps: function() {
        return {
            type: 'text',
            addonBefore: null,
            addonAfter: null,
            buttonBefore: null,
            buttonAfter: null
        };
    },

    changeValue: function(event) {
        var value = event.currentTarget.value;
        this.setValue(value);
        this.props.onChange(this.props.name, value);
    },

    render: function() {
        var element = this.renderElement();

        if (this.props.type === 'hidden') {
            return element;
        }

        if (this.props.addonBefore || this.props.addonAfter || this.props.buttonBefore || this.props.buttonAfter) {
            element = this.renderInputGroup(element);
        }

        if (this.getLayout() === 'elementOnly') {
            return element;
        }

        return (
            <Row
                {...this.getRowProperties()}
                htmlFor={this.getId()}
            >
                {element}
                {this.renderHelp()}
                {this.renderErrorMessage()}
            </Row>
        );
    },

    renderElement: function() {
        var className = 'form-control'
        if (this.showErrors()) {
            className = 'form-control-danger form-control'
        }
        if (['range'].indexOf(this.props.type) !== -1) {
            className = null;
        }
        return (
            <input
                ref={(c) => this.element = c}
                className={className}
                {...propUtilities.cleanProps(this.props)}
                id={this.getId()}
                value={this.getValue()}
                onChange={this.changeValue}
                disabled={this.isFormDisabled() || this.props.disabled}
            />
        );
    },

    renderInputGroup: function(element) {
        return (
            <div className="input-group">
                {this.renderAddon(this.props.addonBefore)}
                {this.renderButton(this.props.buttonBefore)}
                {element}
                {this.renderAddon(this.props.addonAfter)}
                {this.renderButton(this.props.buttonAfter)}
            </div>
        );
    },

    renderAddon: function(addon) {
        if (!addon) {
            return false;
        }
        return (
            <span className="input-group-addon">{addon}</span>
        );
    },

    renderButton: function(button) {
        if (!button) {
            return false;
        }
        return (
            <span className="input-group-btn">{button}</span>
        );
    }

});

module.exports = Input;
