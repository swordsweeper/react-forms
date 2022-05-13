import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./TypeAheadDropdown.scss";
import find from "lodash/find";
import map from "lodash/map";

export default function TypeAheadDropdown(props) {
    const [suggestions, setSuggestions] = useState([]);
    const [showNoMatchesFound, setShowNoMatchesFound] = useState(false);
    const [searchValue, setSearchValue] = useState(null);
    const [showSuggestionList, setShowSuggestionList] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const rootRef = useRef();

    useEffect(() => {
        const handleWindowClick = () => {
            setSuggestions([]);
            setShowSuggestionList(false);
            setSearchValue(null);
        }
        window.addEventListener("click", handleWindowClick);
        return () => {
            window.removeEventListener("click", handleWindowClick);
        };
    }, []);

    useEffect(() => {
        setShowTop(window.innerHeight / 2 < rootRef.current.getBoundingClientRect().top);
    }, [showSuggestionList]);

    const suggestionLabel = find(props.options, {value: props.value})?.label;
    const currentSearchValue = searchValue !== null ? searchValue : suggestionLabel || "";

    const getFilteredOptions = (value) => {
        if (value) {
            const searchString = value.toLowerCase();
            return props.options.filter(option => option.label.toLowerCase().includes(searchString));
        } else {
            return props.options;
        }
    }

    const handleChangeSearch = (e) => {
        let newSuggestions;
        const value = e.target.value;
        if (value.length > 0) {
            newSuggestions = getFilteredOptions(value);
        } else {
            newSuggestions = props.options;
        }

        setSuggestions(newSuggestions);
        const hasMatches = newSuggestions.length > 0;
        setShowSuggestionList(hasMatches);
        if (props.onAddNewOption) {
            setShowNoMatchesFound(!hasMatches);
        }

        setSearchValue(value);
        // props.onChange({
        //     name: props.name,
        //     value,
        // });
    };

    const onSuggestionSelected = (selectedValue) => {
        setShowSuggestionList(false);
        setShowNoMatchesFound(false);
        setSearchValue(null);
        setSuggestions([]);
        props.onChange({
            name: props.name,
            value: selectedValue,
        });
    };

    const handleToggleSuggestionList = () => {
        if (!showSuggestionList) {
            setSuggestions(getFilteredOptions(currentSearchValue));
            setShowSuggestionList(true);
            setShowNoMatchesFound(false);
        } else if (props.value) {
            setSuggestions(props.options);
            setSearchValue(null);
            props.onChange({
                name: props.name,
                value: null,
            });
        } else {
            setSuggestions([]);
            setShowSuggestionList(false);
            setShowNoMatchesFound(false);
            setSearchValue(null);
            props.onChange({
                name: props.name,
                value: null,
            });
        }
    }

    const handleFocus = () => {
        setShowSuggestionList(true);
        setSuggestions(getFilteredOptions(currentSearchValue));
    }

    const handleAddNewClick = async () => {
        const { create, afterCreate } = props.onAddNewOption;
        try {
            // Create new option (api call)
            const response = await create(currentSearchValue);
            const createdOption = response.body;
            onSuggestionSelected(createdOption.id); // Select the newly created option
            if (afterCreate) {
                afterCreate(createdOption); // Callback function with new data (update redux)
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div
            className={classnames(styles.typeAheadRoot, "form-group", {
                "invalid": props.invalid,
            })}
            data-testid="root"
            onClick={(e) => e.stopPropagation()}
        >
            {props.label && (
                <label data-testid="label">
                    {props.label} {props.isRequired && <i className="fa fa-asterisk text-warn text-sm" /> }
                </label>
            )}
            <div className={styles.inputContainer} ref={rootRef}>
                <input
                    value={currentSearchValue}
                    data-testid="type-ahead-dropdown-input"
                    onChange={handleChangeSearch}
                    autoFocus={props.autoFocus}
                    placeholder={props.placeholder}
                    type={props.type}
                    className={classnames({
                        [styles.fixedInput]: !searchValue && suggestionLabel
                    })}
                    onFocus={handleFocus}
                />
                <button
                    className={styles.selectButton}
                    onClick={handleToggleSuggestionList}
                    type="button"
                >
                    {!showSuggestionList && (<i className="mdi mdi-chevron-down" />)}
                    {showSuggestionList && (<i className="mdi mdi-close" />)}
                </button>
            </div>
            {showSuggestionList && (
                <div className={classnames(styles.suggestionList, {
                    [styles.top]: showTop,
                })}>
                    {map(suggestions, (suggestion) => (
                        <div
                            className={styles.suggestionItem}
                            key={suggestion.id}
                            onClick={() => onSuggestionSelected(suggestion.value)}
                        >
                            {suggestion.label}
                        </div>
                    ))}
                </div>
            )}

            {showNoMatchesFound && (
                <div className={classnames(styles.suggestionList, {
                    [styles.top]: showTop,
                })}>
                    <div className={styles.suggestionItem}>
                        <div className="margin-bottom-10">
                            No matches found for <b>{currentSearchValue}</b>.
                        </div>
                        <div
                            className="link"
                            onClick={handleAddNewClick}
                        >
                            <i className="mdi mdi-plus" /> Add new
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

TypeAheadDropdown.propTypes = {
    value: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    label: PropTypes.string,
    name: PropTypes.string,
    invalid: PropTypes.bool,
    isRequired: PropTypes.bool,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    onAddNewOption: PropTypes.shape({
        create: PropTypes.func,
        afterCreate: PropTypes.func,
    }),
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
    })).isRequired,
};

TypeAheadDropdown.defaultProps = {
    type: "text",
};