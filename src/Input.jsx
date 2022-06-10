import React, {useState} from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default function Input(props) {
    const [focused, setFocused] = useState(false);
    const handleChange = (e) => {
        props.onChange({
            name: props.name,
            value: e.target.value,
        });
    };

    const handleKeyDown = (e) => {
        if (e.keyCode && e.keyCode === 13) { // enter
            props.onEnterPress && props.onEnterPress();
        }
    };

    const handleFocus = () => {
        setFocused(true);
    };

    const handleBlur = () => {
        setFocused(false);
    };

    return (
        <div
            className={classnames("form-group", {
                "invalid": props.invalid,
                "focused": focused,
                "form-group-inline": props.inline,
            })}
        >
            {props.label && (
                <label data-testid="label">
                    {props.label} {props.isRequired && <i className="fa fa-asterisk text-warn text-sm" /> }
                </label>
            )}
            <input
                type={props.inputType || "text"}
                onChange={handleChange}
                value={props.value || ""}
                autoFocus={props.autoFocus}
                placeholder={props.placeholder}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={props.disabled}
            />
        </div>
    );
}

Input.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
    autoFocus: PropTypes.bool,
    invalid: PropTypes.bool,
    placeholder: PropTypes.string,
    onEnterPress: PropTypes.func,
    inputType: PropTypes.oneOf(["email", "text", "number"]),
    inline: PropTypes.bool,
    disabled: PropTypes.bool,
    isRequired: PropTypes.bool,
};

