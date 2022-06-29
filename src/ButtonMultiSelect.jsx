import React from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import without from "lodash/without";

export default function ButtonMultiSelect(props) {
    const handleToggleValue = (val) => {
        let newValue;
        if (props.value?.includes(val)) {
            newValue = without(props.value, val);
        } else {
            newValue = [
                ...(props.value || []),
                val,
            ];
        }

        props.onChange({
            name: props.name,
            value: newValue,
        });
    };

    return (
        <div
            className={classnames("form-group", {
                "invalid": props.invalid,
                "form-group-inline": props.inline,
            })}
        >
            {!!props.label && (<label>{props.label}</label>)}
            {props.options.map(opt => {
                const active = !!props.value?.includes(opt.value);
                return (
                    <button
                        className={classnames("form-input-btn", {
                            [props.defaultClassName]: !active,
                            [props.activeClassName]: active,
                        })}
                        key={opt.value}
                        onClick={() => handleToggleValue(opt.value)}
                        data-testid="input-button"
                    >
                        {opt.label}
                    </button>
                )
            })}
        </div>
    );
}

ButtonMultiSelect.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.arrayOf(PropTypes.any),
    autoFocus: PropTypes.bool,
    invalid: PropTypes.bool,
    disabled: PropTypes.bool,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.node,
        value: PropTypes.any,
    })).isRequired,
    defaultClassName: PropTypes.string.isRequired,
    activeClassName: PropTypes.string.isRequired,
};
