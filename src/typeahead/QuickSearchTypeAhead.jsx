import React, { useState } from "react";
import PropTypes from "prop-types";
import uniqBy from "lodash/uniqBy";
import TypeAheadDropdown from "./TypeAheadDropdown";

export default function QuickSearchTypeAhead(props) {
    const [suggestions, setSuggestions] = useState([]);

    const doSearch = (searchTerm, searchString) => {
        return props.options.filter(option => option[searchTerm].toLowerCase().includes(searchString));
    };

    const handleSearch = (searchTerm) => {
        let newSuggestions = [];
        if (searchTerm.length > 0) {
            // Do search inside component with passed in options & search fields
            const { searchFields } = props;
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
            newSuggestions = props.options;
        }
        setSuggestions(newSuggestions)
    };

    return (
        <TypeAheadDropdown
            onSearch={handleSearch}
            suggestions={suggestions}
            {...props}
        />
    );
}

QuickSearchTypeAhead.propTypes = {
    label: PropTypes.string,
    name: PropTypes.string,
    invalid: PropTypes.bool,
    isRequired: PropTypes.bool,
    autoFocus: PropTypes.bool,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    renderSuggestion: PropTypes.func.isRequired,
    options: PropTypes.array.isRequired,
    searchFields: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
    onSelect: PropTypes.func.isRequired,
};

QuickSearchTypeAhead.defaultProps = {
    type: "text",
};
