import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Input, useFormHandlers } from "../src"; // @swordsweeper/react-forms
import TypeAheadDropdown from "../src/TypeAheadDropdown";
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
                <h4>Instantaneous Search</h4>
                <TypeAheadDropdown
                    name="shape1"
                    label="Shape 1"
                    value={formData.shape1}
                    onChange={handleUpdate}
                    onSearch={{
                        options: mockOptions,
                        searchFields: ["name", "sides"]
                    }}
                    renderSuggestion={(shape) => `${shape.name} - (${shape.sides} sides)`}
                />

                <h4>Asynchronous Search</h4>
                <TypeAheadDropdown
                    name="shape2"
                    label="Shape 2"
                    value={formData.shape2}
                    onChange={handleUpdate}
                    onSearch={{
                        apiMethod: mockApiSearchMethod,
                        searchFilters: {}
                    }}
                    renderSuggestion={(shape) => `${shape.name} - (${shape.sides} sides)`}
                />
                <pre>
                    Api called {typeAheadApiHitCounter} times
                </pre>
                <pre>
                    {JSON.stringify(formData)}
                </pre>

                <ComponentPropTypes
                    component={TypeAheadDropdown}
                />
            </div>
        </div>
    );
}

ExampleRoot.propTypes = {

};
