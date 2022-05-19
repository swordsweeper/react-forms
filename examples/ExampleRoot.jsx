import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Input, useFormHandlers } from "../src"; // @swordsweeper/react-forms
import QuickSearchTypeAhead from "../src/typeahead/QuickSearchTypeAhead";
import AsyncTypeAhead from "../src/typeahead/AsyncTypeAhead";
import styles from "./ExampleRoot.scss";
import map from "lodash/map";

const mockOptions = [
    {
        name: "Square",
        id: "square",
        sides: "four",
    },
    {
        name: "Circle",
        id: "circle",
        sides: "zero",
    },
    {
        name: "Triangle",
        id: "triangle",
        sides: "three",
    },
    {
        name: "Oval",
        id: "oval",
        sides: "zero",
    },
    {
        name: "Pentagon",
        id: "pentagon",
        sides: "five",
    },
    {
        name: "Rectangle",
        id: "rectangle",
        sides: "four",
    },
    {
        name: "Parallelogram",
        id: "parallelogram",
        sides: "four",
    }
];

const ComponentPropTypes = (props) => {
    const { component } = props;
    return (
        <>
            <h4>Props</h4>
            {map(component.propTypes, (propTypeValue, propTypeKey) => {
                return (
                    <div key={propTypeKey}>
                        {propTypeKey}
                    </div>
                );
            })}
        </>
    );
};

export default function ExampleRoot(props) {
    const {handleUpdate, formData} = useFormHandlers();
    const [typeAheadApiHitCounter, setTypeAheadHitCounter] = useState(0);
    const typeAheadApiHitRef = useRef(0);

    const mockApiSearchMethod = ({ search }) => {
        const newHitCount = typeAheadApiHitRef.current + 1;
        setTypeAheadHitCounter(newHitCount);
        typeAheadApiHitRef.current = newHitCount;
        const searchTerm = search.toLowerCase();
        const searchResults = mockOptions.filter(option => option.name.toLowerCase().includes(searchTerm));
        const mockResponse = {
            body: {
                results: searchResults,
            }
        };
        return mockResponse;
    };

    return (
        <div className={styles.root}>
            <div className={styles.componentCard}>
                <h3>Input</h3>
                <Input
                    name="firstName"
                    label="firstName"
                    value={formData.firstName}
                    onChange={handleUpdate}
                />
                <pre>
                    {JSON.stringify(formData)}
                </pre>

                <ComponentPropTypes
                    component={Input}
                />
            </div>

            <div className={styles.componentCard}>
                <h3>Type Ahead</h3>
                <h4>Quick Search</h4>
                <QuickSearchTypeAhead
                    label="Shape 1"
                    name="shape1"
                    onSelect={handleUpdate}
                    options={mockOptions}
                    searchFields={["name", "sides"]}
                    renderSuggestion={(shape) => `${shape.name} - (${shape.sides} sides)`}
                />
                <ComponentPropTypes
                    component={QuickSearchTypeAhead}
                />

                <h4>Asynchronous Search</h4>
                <AsyncTypeAhead
                    label="Shape 2"
                    name="shape2"
                    onSelect={handleUpdate}
                    apiMethod={mockApiSearchMethod}
                    renderSuggestion={(shape) => `${shape.name} - (${shape.sides} sides)`}
                />
                <pre>
                    Api called {typeAheadApiHitCounter} times
                </pre>
                <ComponentPropTypes
                    component={AsyncTypeAhead}
                />

                <pre>
                    {JSON.stringify(formData)}
                </pre>
            </div>
        </div>
    );
}

ExampleRoot.propTypes = {

};
