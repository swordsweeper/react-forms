import React from "react";

import { render } from "@testing-library/react";
import ButtonMultiSelect from "./ButtonMultiSelect";

describe("ButtonMultiSelect", () => {
    it("should render", () => {
        const {queryAllByTestId} = render(
            <ButtonMultiSelect
                value={[]}
                name="name"
                onChange={() => {}}
                options={[{
                    value: "one",
                    label: "One"
                }, {
                    value: "two",
                    label: "Two"
                }, {
                    value: "three",
                    label: "Three",
                }]}
                defaultClassName="button"
                activeClassName="active-button"
            />
        );
        expect(queryAllByTestId("input-button").length).toBe(3);
    });
});
