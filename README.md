### Disclaimer
This package is in development and should not be considered stable yet. 

### Description
This is a set of common form components and patterns used in projects built by 
Swordsweeper industries. This library strives to balance flexibility with ease of use.

### Basic example (Hooks)

```
import {useFormHandlers, Input} from "@swordsweeper/react-forms";

export default function ExampleForm(props) {
    const {formData, handleUpdate} = useFormHandlers();
    return (
        <form>
            <Input 
                value={formData.firstName}
                name="firstName" 
                onChange={handleUpdate} 
            />
        </form>
    );
} 
```
 

### Dev Commands

Run the test page
* `npm start`
* Navigate to localhost:3000

Run Jest tests
* `npm test`

Run Jest coverage
* `npm test:coverage` 
