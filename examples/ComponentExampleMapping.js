
export default {
    Input: {
        exampleCode: `
            import { Input } from "@swordsweeper/react-forms";

            <Input
                name="firstName"
                label="firstName"
                value={formData.firstName}
                onChange={handleUpdate}
            />
        `
    },
    QuickSearchTypeAhead: {
        exampleCode: `
            import { QuickSearchTypeAhead } from "@swordsweeper/react-forms";

            <QuickSearchTypeAhead
                label="Shape 1"
                name="shape1"
                onSelect={handleUpdate}
                options={mockOptions}
                searchFields={["name", "sides"]}
                renderSuggestion={renderFn}
            />
        `
    },
    AsyncSearchTypeAhead: {
        exampleCode: `
            import { AsyncSearchTypeAhead } from "@swordsweeper/react-forms";

            <AsyncSearchTypeAhead
                label="Shape 2"
                name="shape2"
                onSelect={handleUpdate}
                apiMethod={mockApiSearchMethod}
                renderSuggestion={renderFn}
                onAddOption={mockAddOption}
            />
        `
    }
};