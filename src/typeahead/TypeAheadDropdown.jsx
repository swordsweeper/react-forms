import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./TypeAheadDropdown.scss";
import map from "lodash/map";

export default function TypeAheadDropdown(props) {
    const [searchValue, setSearchValue] = useState(props.initialValue);
    const [showSuggestionList, setShowSuggestionList] = useState(false);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [shouldAutoFocus, setShouldAutoFocus] = useState(false);
    const [focusedSuggestion, setFocusedSuggestion] = useState(null);
    const [isEditingSelection, setIsEditingSelection] = useState(true);
    const [showTop, setShowTop] = useState(false);
    const rootRef = useRef();
    const inputRef = useRef();

    useEffect(() => {
        const handleWindowClick = () => {
            if (showSuggestionList) {
                // Close the suggestion list if it is open
                setShowSuggestionList(false);
            }
            if (selectedSuggestion && isEditingSelection) {
                // Revert back to showing the selection if it was being edited
                setIsEditingSelection(false);
            }
        }
        window.addEventListener("click", handleWindowClick);
        return () => {
            window.removeEventListener("click", handleWindowClick);
        };
    }, [showSuggestionList, selectedSuggestion, isEditingSelection]);

    useEffect(() => {
        setShowTop(window.innerHeight / 2 < rootRef.current.getBoundingClientRect().top);
    }, [showSuggestionList]);

    useEffect(() => {
        setShowSuggestionList(props.suggestions.length > 0);
    }, [props.suggestions]);

    const handleToggleSuggestionList = () => {
        if (!showSuggestionList) {
            inputRef.current?.focus();
        } else {
            setShowSuggestionList(false);
        }
    };

    const handleFocus = () => {
        setShowSuggestionList(true);
        props.onSearch(searchValue);
    };

    const handleSuggestionFocused = (selection) => {
        setFocusedSuggestion(selection);
    };

    const handleSetSelection = (selection) => {
        setSelectedSuggestion(selection);
        setShouldAutoFocus(true);
        props.onSelect({
            name: props.name,
            value: selection,
        });
        setIsEditingSelection(false);
    };

    const handleSelectSuggestion = async (selection) => {
        if (selection.onSelect) {
            const newOption = await selection.onSelect();
            if (newOption) {
                handleSetSelection(newOption);
            }
        } else {
            handleSetSelection(selection);
        }
    };

    const handleClearSelection = () => {
        setSelectedSuggestion(null);
        setSearchValue("");
        props.onSelect({
            name: props.name,
            value: "",
        });
        if (inputRef.current) {
            inputRef.current.focus();
        } else {
            setShouldAutoFocus(true);
        }
        props.onSearch("");
    };

    const handleSearchValueChanged = (e) => {
        const { value } = e.target;
        setSearchValue(value);
        props.onSearch(value);
        setSelectedSuggestion(null);
        setShouldAutoFocus(false);
    };

    const handleCheckEnterPress = (e) => {
        if (e.keyCode === 13) {
            // Enter key pressed
            if (focusedSuggestion) {
                handleSelectSuggestion(focusedSuggestion);
            }
        }
    };

    const clearSelectionButton = (
        <button
            className={styles.clearSelectionButton}
            onClick={handleClearSelection}
            type="button"
            title="Clear Selection"
        >
            <i className="fas fa-times" />
        </button>
    );

    return (
        <div
            className={classnames(styles.typeAheadRoot, {[styles.invalid]: props.invalid})}
            onClick={(e) => e.stopPropagation()}
            ref={rootRef}
            id={props.id}
        >
            {props.label && (
                <label data-testid="label">
                    {props.label} {props.isRequired && <i className="fa fa-asterisk text-warn text-sm" /> }
                </label>
            )}
            {(selectedSuggestion && !isEditingSelection) ? (
                <div
                    onClick={() => setIsEditingSelection(true)}
                    className={styles.selectedSuggestion}
                >
                    {props.renderSuggestion(selectedSuggestion)}
                    {clearSelectionButton}
                </div>
            ) : (
                <div onKeyDown={handleCheckEnterPress}>
                    <div className={styles.inputContainer} >
                        <input
                            ref={inputRef}
                            value={searchValue}
                            data-testid="type-ahead-dropdown-input"
                            onChange={handleSearchValueChanged}
                            autoFocus={props.autoFocus || shouldAutoFocus}
                            onFocus={handleFocus}
                            placeholder={props.placeholder}
                            type={props.type}
                            disabled={props.disabled}
                        />
                        <button
                            className={styles.selectButton}
                            onClick={handleToggleSuggestionList}
                            type="button"
                            tabIndex="-1"
                        >
                            <i className={classnames("fas fa-chevron-down", styles.selectButtonIcon, {[styles.expanded]: showSuggestionList})} />
                        </button>
                        {clearSelectionButton}
                    </div>
                    {(showSuggestionList && props.suggestions.length > 0) && (
                        <div
                            className={classnames(styles.suggestionList, {
                                [styles.top]: showTop,
                            })}
                            id={`${props.id}-suggestion-list`}
                        >
                            {map(props.suggestions, (suggestion) => (
                                <div
                                    className={styles.suggestionItem}
                                    key={suggestion.id}
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    tabIndex="0"
                                    onFocus={() => handleSuggestionFocused(suggestion)}
                                >
                                    {suggestion.customRender ? (
                                        suggestion.customRender(suggestion)
                                    ) : (
                                        props.renderSuggestion(suggestion)
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

TypeAheadDropdown.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    invalid: PropTypes.bool,
    disabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    suggestions: PropTypes.array.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
    id: PropTypes.string,
};

TypeAheadDropdown.defaultProps = {
    type: "text",
    initialValue: "",
    id: "type-ahead-dropdown"
};
