import React from "react";
import PropTypes from "prop-types";
import {Input, useFormHandlers} from "../src"; // @swordsweeper/react-forms

export default function ExampleRoot(props) {
    const {handleUpdate, formData} = useFormHandlers();
    return (
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
    );
}

ExampleRoot.propTypes = {

};
