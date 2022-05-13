import React from "react";
import PropTypes from "prop-types";
import { Input, useFormHandlers } from "../src"; // @swordsweeper/react-forms
import TypeAheadDropdown from "../src/TypeAheadDropdown";

export default function ExampleRoot(props) {
    const {handleUpdate, formData} = useFormHandlers();
    return (
        <div>
            <div>
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
            </div>

            <div>
                <h3>Typeahead</h3>
                <TypeAheadDropdown
                    name="shape"
                    label="Shape"
                    value={formData.shape}
                    onChange={handleUpdate}
                    options={[
                        {
                            label: "Square",
                            value: "square",
                        },
                        {
                            label: "Circle",
                            value: "circle",
                        },
                        {
                            label: "Triangle",
                            value: "triangle",
                        },
                        {
                            label: "Oval",
                            value: "oval",
                        },
                        {
                            label: "Pentagon",
                            value: "pentagon",
                        },
                        {
                            label: "Rectangle",
                            value: "rectangle",
                        },
                        {
                            label: "Parallelogram",
                            value: "parallelogram",
                        }
                    ]}
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
