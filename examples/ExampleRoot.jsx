import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Input, QuickSearchTypeAhead, AsyncSearchTypeAhead, useFormHandlers } from "../src"; // @swordsweeper/react-forms
import styles from "./ExampleRoot.scss";
import classnames from "classnames";
import map from "lodash/map";
import ComponentExampleMapping from "./ComponentExampleMapping";

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

const ComponentInformation = (props) => {
    const [showTextCopied, setShowTextCopied] = useState(false);
    const { component } = props;
    const exampleUsage = ComponentExampleMapping[component.name]?.exampleCode;

    const handleCopyCode = () => {
        navigator.clipboard.writeText(exampleUsage);
        setShowTextCopied(true);
        setTimeout(() => {
            setShowTextCopied(false);
        }, 2500);
    };

    return (
        <div className={styles.usageBlock}>
            <div>
                <h4>Props</h4>
                {map(component.propTypes, (propTypeValue, propTypeKey) => {
                    return (
                        <div key={propTypeKey}>
                            {propTypeKey}
                        </div>
                    );
                })}
            </div>
            {exampleUsage && (
                <div>
                    <h4 className={styles.usageHeader}>
                        <span>Usage</span>
                        <i
                            className={classnames("fas fa-copy", styles.copyToClipboardButton)}
                            onClick={handleCopyCode}
                        />
                        {showTextCopied && (
                            <div className={styles.textCopied}>Copied to Clipboard</div>
                        )}
                    </h4>
                    <pre>
                        {exampleUsage}
                    </pre>
                </div>
            )}
        </div>
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
            <div className={styles.componentsRoot}>
                <div className={styles.componentCard}>
                    <h3>Input</h3>
                    <Input
                        name="firstName"
                        label="firstName"
                        value={formData.firstName}
                        onChange={handleUpdate}
                    />
                    <ComponentInformation
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
                    <ComponentInformation
                        component={QuickSearchTypeAhead}
                    />

                    <h4>Asynchronous Search</h4>
                    <AsyncSearchTypeAhead
                        label="Shape 2"
                        name="shape2"
                        onSelect={handleUpdate}
                        apiMethod={mockApiSearchMethod}
                        renderSuggestion={(shape) => `${shape.name} - (${shape.sides} sides)`}
                    />
                    <pre>
                        Api called {typeAheadApiHitCounter} times
                    </pre>
                    <ComponentInformation
                        component={AsyncSearchTypeAhead}
                    />
                </div>
            </div>

            <div className={styles.formDataCard}>
                <h3>Data</h3>
                <pre>
                    {JSON.stringify(formData, undefined, 2)}
                </pre>
            </div>
        </div>
    );
}

ExampleRoot.propTypes = {

};
