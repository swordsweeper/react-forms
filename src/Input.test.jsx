import React from "react";

import { render } from "@testing-library/react";
import Input from "./Input";

describe("Input", () => {
    it("should render", () => {
        const {getByTestId} = render(
            <Input
                value="value"
                name="name"
                onChange={() => {}}
            />
        );
    });
});
