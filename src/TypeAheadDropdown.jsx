import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import styles from "./TypeAheadDropdown.scss";
import map from "lodash/map";
import uniqBy from "lodash/uniqBy";
import debounce from "lodash/debounce";

export default function TypeAheadDropdown(props) {
    const [suggestions, setSuggestions] = useState([]);
    const [showNoMatchesFound, setShowNoMatchesFound] = useState(false);
    const [searchValue, setSearchValue] = useState(null);
    const [showSuggestionList, setShowSuggestionList] = useState(false);
    const [showTop, setShowTop] = useState(false);
    const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
    const rootRef = useRef();
    const currentSearchValue = searchValue !== null ? searchValue : (props.value || "");

    useEffect(() => {
        const handleWindowClick = () => {
            if (showSuggestionList) {
                // Close the suggestion list if it is open
                setSuggestions([]);
                setShowSuggestionList(false);
            }
        }
        window.addEventListener("click", handleWindowClick);
        return () => {
            window.removeEventListener("click", handleWindowClick);
        };
    }, [showSuggestionList]);

    useEffect(() => {
        setShowTop(window.innerHeight / 2 < rootRef.current.getBoundingClientRect().top);
    }, [showSuggestionList]);

    const applySuggestions = (newSuggestions) => {
        setSuggestions(newSuggestions);
        // Show the suggestion list if there are matches
        const hasMatches = newSuggestions.length > 0;
        setShowSuggestionList(hasMatches);
        if (props.onAddNewOption) {
            setShowNoMatchesFound(!hasMatches);
        }
    };

    const doSearch = (searchTerm, searchString) => {
        return props.onSearch.options.filter(option => option[searchTerm].toLowerCase().includes(searchString));
    };

    const debouncedSearch = useCallback(debounce(async (searchTerm) => {
        try {
            const { apiMethod, searchFilters } = props.onSearch;
            const combinedSearchFilters = {
                ...searchFilters,
                search: searchTerm,
            };
            const response = await apiMethod(combinedSearchFilters);
            applySuggestions(response.body.results);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingSearchResults(false);
        }
    }, 500), [...Object.values(props.onSearch.searchFilters || {})]);

    const handleSearch = (searchTerm) => {
        let newSuggestions = [];
        if (!!props.onSearch?.apiMethod) {
            // Do async function call
            setIsLoadingSearchResults(true);
            debouncedSearch(searchTerm);
        } else {
            if (searchTerm.length > 0) {
                // Do search inside component with passed in options & search fields
                const { searchFields } = props.onSearch;
                const searchString = searchTerm.toLowerCase();
                if (Array.isArray(searchFields)) {
                    // Do a search with all of the search fields
                    searchFields.map(searchTerm => {
                        newSuggestions.push(...doSearch(searchTerm, searchString))
                    });
                    // Only use unique values
                    newSuggestions = uniqBy(newSuggestions, "id");
                } else {
                    newSuggestions = doSearch(searchFields, searchString);
                }
            } else {
                newSuggestions = props.onSearch.options;
            }
            
            applySuggestions(newSuggestions);
        }
        setSearchValue(searchTerm);
    };

    const onSuggestionSelected = (selection) => {
        const value = selection[props.onSelectReturnField]; // By default the selected item's ID is returned
        setShowSuggestionList(false);
        setShowNoMatchesFound(false);
        setSearchValue(selection[props.onSelectDisplayField]);
        setSuggestions([]);
        props.onChange({
            name: props.name,
            value,
        });
        if (props.onSuggestionSelected) {
            props.onSuggestionSelected(selection);
        }
    };

    const handleToggleSuggestionList = () => {
        if (!showSuggestionList) {
            handleSearch(currentSearchValue);
            setShowSuggestionList(true);
            setShowNoMatchesFound(false);
        } else {
            setShowSuggestionList(false);
            setShowNoMatchesFound(false);
            setSuggestions(null);
            setSearchValue(null);
            props.onChange({
                name: props.name,
                value: null,
            });
        }
    }

    const handleFocus = () => {
        setShowSuggestionList(true);
        handleSearch(currentSearchValue);
    }

    const handleAddNewClick = async () => {
        const { create, afterCreate } = props.onAddNewOption;
        try {
            // Create new option (api call)
            const response = await create(currentSearchValue);
            const createdOption = response.body;
            onSuggestionSelected(createdOption); // Select the newly created option
            if (afterCreate) {
                afterCreate(createdOption); // Callback function with new data (update redux)
            }
        } catch (e) {
            console.error(e);
        }
    };

    let suggestionListContent;
    if (isLoadingSearchResults) {
        suggestionListContent = (
            <span>
                Loading
            </span>
        );
    } else if (suggestions && showSuggestionList) {
        suggestionListContent = map(suggestions, (suggestion) => (
            <div
                className={styles.suggestionItem}
                key={suggestion.id}
                onClick={() => onSuggestionSelected(suggestion)}
            >
                {props.renderSuggestion(suggestion)}
            </div>
        ));
    } else if (showNoMatchesFound) {
        suggestionListContent = (
            <div className={styles.suggestionItem}>
                <div className="margin-bottom-10">
                    No matches found for <b>{currentSearchValue}</b>.
                </div>
                <div
                    className="link"
                    onClick={handleAddNewClick}
                >
                    <i className="fas fa--plus" /> Add new
                </div>
            </div>
        );
    }

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
                    onChange={(e) => handleSearch(e.target.value)}
                    autoFocus={props.autoFocus}
                    placeholder={props.placeholder}
                    type={props.type}
                    onFocus={handleFocus}
                />
                <button
                    className={styles.selectButton}
                    onClick={handleToggleSuggestionList}
                    type="button"
                >
                    <i className={classnames("fas fa-chevron-down", styles.selectButtonIcon, {[styles.expanded]: showSuggestionList})} />
                </button>
            </div>
            {suggestionListContent && (
                <div className={classnames(styles.suggestionList, {
                    [styles.top]: showTop,
                })}>
                    {suggestionListContent}
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
    renderSuggestion: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func,
    onSelectDisplayField: PropTypes.string,
    onSelectReturnField: PropTypes.string,
    onAddNewOption: PropTypes.shape({
        create: PropTypes.func,
        afterCreate: PropTypes.func,
    }),
    onSearch: PropTypes.oneOfType([
        // For in-component-searching (options are already loaded)
        PropTypes.shape({
            options: PropTypes.array,
            searchFields: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.arrayOf(PropTypes.string),
            ]),
        }),
        // Can be a callback function (asynchronous api searching)
        PropTypes.shape({
            apiMethod: PropTypes.func,
            searchFilters: PropTypes.object,
        }),
    ]).isRequired,
};

TypeAheadDropdown.defaultProps = {
    type: "text",
    onSelectReturnField: "id",
    onSelectDisplayField: "name",
};
