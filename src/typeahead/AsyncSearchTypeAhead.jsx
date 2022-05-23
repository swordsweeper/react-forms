import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import TypeAheadDropdown from "./TypeAheadDropdown";
import styles from "./AsyncSearchTypeAhead.scss";
import classnames from "classnames";

export default function AsyncSearchTypeAhead(props) {
    const [suggestions, setSuggestions] = useState([]);
    const [showNoMatchesFound, setShowNoMatchesFound] = useState(false);
    const [isLoadingSearchResults, setIsLoadingSearchResults] = useState(false);

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
    };

    // const handleAddNewClick = async () => {
    //     const { create, afterCreate } = props.onAddNewOption;
    //     try {
    //         // Create new option (api call)
    //         const response = await create(currentSearchValue);
    //         const createdOption = response.body;
    //         onSuggestionSelected(createdOption); // Select the newly created option
    //         if (afterCreate) {
    //             afterCreate(createdOption); // Callback function with new data (update redux)
    //         }
    //     } catch (e) {
    //         console.error(e);
    //     }
    // };

    return (
        <div className={classnames({[styles.loading]: isLoadingSearchResults})}>
            <TypeAheadDropdown
                onSearch={handleSearch}
                suggestions={isLoadingSearchResults ? [] : suggestions}
                {...props}
            />
        </div>
    );
}

AsyncSearchTypeAhead.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    invalid: PropTypes.bool,
    isRequired: PropTypes.bool,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    renderSuggestion: PropTypes.func.isRequired,
    // onAddNewOption: PropTypes.shape({
    //     create: PropTypes.func,
    //     afterCreate: PropTypes.func,
    // }),
    apiMethod: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    initialValue: PropTypes.string,
};

AsyncSearchTypeAhead.defaultProps = {
    type: "text",
};
