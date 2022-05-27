import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import TypeAheadDropdown from "./TypeAheadDropdown";
import styles from "./AsyncSearchTypeAhead.scss";
import classnames from "classnames";

export default function AsyncSearchTypeAhead(props) {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);
    const [isAddingNewOption, setIsAddingNewOption] = useState(false);
    const [lastSearchTerm, setLastSearchTerm] = useState("");

    const debouncedSearch = useCallback(debounce(async (searchTerm) => {
        try {
            const { apiMethod } = props;
            const searchFilters = {
                search: searchTerm,
            };
            const response = await apiMethod(searchFilters);
            setSuggestions(response.body.results);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingSearchResults(false);
        }
    }, 500), []);

    const handleSearch = (searchTerm) => {
        // Do async function call
        setIsLoadingSearchResults(true);
        debouncedSearch(searchTerm);
        setLastSearchTerm(searchTerm);
    };

    const handleAddOption = async () => {
        if (!isAddingNewOption) {
            setIsAddingNewOption(true);
            try {
                const newOption = await props.onAddOption(lastSearchTerm);
                if (newOption) {
                    setSuggestions([
                        ...suggestions,
                        newOption,
                    ]);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsAddingNewOption(false);
            }
        }
    };

    const suggestionsList = (lastSearchTerm && props.onAddOption) ? [
        ...suggestions,
        {
            id: "add-new-suggestion",
            onSelect: handleAddOption,
            customRender: () => (
                <div className={styles.addOptionContainer}>
                    Create "<span className={styles.searchTerm}>{lastSearchTerm}</span>"
                    {isAddingNewOption && (
                        <i className={classnames("fad fa-spinner-third", styles.addOptionLoader)} />
                    )}
                </div>
            )
        }
    ] : suggestions;

    return (
        <div className={classnames({[styles.loading]: isLoadingSearchResults})}>
            <TypeAheadDropdown
                onSearch={handleSearch}
                suggestions={isLoadingSearchResults ? [] : suggestionsList}
                {...props}
            />
        </div>
    );
}

AsyncSearchTypeAhead.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    invalid: PropTypes.bool,
    disabled: PropTypes.bool,
    isRequired: PropTypes.bool,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    renderSuggestion: PropTypes.func.isRequired,
    apiMethod: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
    onAddOption: PropTypes.func,
};

AsyncSearchTypeAhead.defaultProps = {
    type: "text",
};
