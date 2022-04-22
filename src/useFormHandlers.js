import {useState, useEffect} from "react";
import {default as setValue} from "lodash/set";
import produce from "immer";
import map from "lodash/map";
import filter from "lodash/filter";
import has from "lodash/has";
import isEqual from "lodash/isEqual";
import pick from "lodash/pick";

export default function useFormHandlers(initialFormState={}, yupSchema, options={}) {
    const [formData, _setFormData] = useState(initialFormState || {});
    const [invalidFields, _setInvalidFields] = useState([]);
    const [isValid, _setIsValid] = useState(false);
    const [hasChanges, _setHasChanges] = useState(false);

    useEffect(() => {
        let source = formData;
        let target = initialFormState;
        if (options.keysToTrack) {
            source = pick(source, options.keysToTrack);
            target = pick(target, options.keysToTrack);
        }
        const changed = !isEqual(source, target);
        _setHasChanges(changed);
    }, [initialFormState]);

    const handleSetFormData = (newData) => {
        _setFormData(newData);
        _setHasChanges(true);
        if (yupSchema) {
            _setIsValid(false);
            yupSchema.validate(newData, {abortEarly: false})
                .then((value) => {
                    _setInvalidFields([]);
                    _setIsValid(true);
                })
                .catch((err) => {
                    const invFields = map(err.inner, (inner) => inner.path);
                    _setInvalidFields(filter(invFields, (field) => has(newData, field)));
                    _setIsValid(false);
                });
        } else {
            _setIsValid(true);
        }
    };

    const handleUpdate = ({name, value}) => {
        const newData = produce(formData, (draftFormData) => {
            setValue(draftFormData, name, value);
            return draftFormData;
        });
        handleSetFormData(newData);
    };
    return {
        formData,
        handleUpdate,
        setFormData: handleSetFormData,
        isValid,
        invalidFields,
        hasChanges
    };
}