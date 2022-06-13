import React from "react";

import { fireEvent, render } from "@testing-library/react";
import TypeAheadDropdown from "./TypeAheadDropdown";

const mockSuggestions = [
    {
        id: "testSuggestion1",
        name: "Test Suggestion 1"
    },
    {
        id: "testSuggestion2",
        name: "Test Suggestion 2"
    }
];

describe("TypeAheadDropdown", () => {
    it("should render with the expected markup", () => {
        const mockOnSelect = jest.fn();
        const mockOnSearch = jest.fn();

        const { getByTestId } = render(
            <TypeAheadDropdown
                suggestions={[]}
                name="typeahead-test"
                renderSuggestion={() => <div data-testid="suggestion">SUGGESTION</div>}
                onSelect={mockOnSelect}
                onSearch={mockOnSearch}
                label="Test Typeahead"
            />
        );

        getByTestId("typeahead-root");
        getByTestId("label");
        getByTestId("type-ahead-dropdown-input");
        getByTestId("dropdown-toggle-suggestion-list-button");
    });

    it("should call on search when the input value is changed", () => {
        const mockOnSelect = jest.fn();
        const mockOnSearch = jest.fn();

        const { getByTestId } = render(
            <TypeAheadDropdown
                suggestions={[]}
                name="typeahead-test"
                renderSuggestion={() => <div data-testid="suggestion">SUGGESTION</div>}
                onSelect={mockOnSelect}
                onSearch={mockOnSearch}
                label="Test Typeahead"
            />
        );

        const input = getByTestId("type-ahead-dropdown-input");
        fireEvent.change(input, {
            target: {
                value: "test",
            },
        });

        expect(mockOnSearch).toBeCalledWith("test");
    });

    it("should call on search when the input value is changed, and call on select when a suggestion is clicked", () => {
        const mockOnSelect = jest.fn();
        const mockOnSearch = jest.fn();

        const { rerender, getByTestId, queryByTestId } = render(
            <TypeAheadDropdown
                suggestions={[]}
                name="typeahead-test"
                renderSuggestion={() => <div data-testid="suggestion">SUGGESTION</div>}
                onSelect={mockOnSelect}
                onSearch={mockOnSearch}
                label="Test Typeahead"
            />
        );

        const input = getByTestId("type-ahead-dropdown-input");
        fireEvent.change(input, {
            target: {
                value: "test",
            },
        });

        expect(mockOnSearch).toBeCalledWith("test");

        rerender(
            <TypeAheadDropdown
                suggestions={mockSuggestions}
                name="typeahead-test"
                renderSuggestion={(suggestion) => <div data-testid={`suggestion-${suggestion.id}`}>{suggestion.name}</div>}
                onSelect={mockOnSelect}
                onSearch={mockOnSearch}
                label="Test Typeahead"
            />
        );

        getByTestId("typeahead-suggestion-list");
        const suggestion1 = getByTestId("suggestion-testSuggestion1");
        getByTestId("suggestion-testSuggestion2");

        fireEvent.click(suggestion1);

        expect(mockOnSelect).toBeCalledWith({
            name: "typeahead-test",
            value: mockSuggestions[0],
        });
        getByTestId("selected-suggestion");
        expect(queryByTestId("typeahead-suggestion-list")).toBeNull();
    });
});
