import { useFormContext } from "react-hook-form"
import { findErrors, InputError, isFormInvalid } from "./InputError";

export const Input = ({ label, type, id, placeholder, validation, name }) => {
    const { register, formState: { errors } } = useFormContext();
    const isInvalid = isFormInvalid(errors);
    const inputError = findErrors(errors, name)

    return (
        <div className="input-container">
            <div className="input-label-container test">
                <label className="input-label">
                    {label}
                </label>
                <div className=4t"input-inner">

                <input id={id}
                    type={type}
                    className={`input-datetime-date ${type}`}
                    // placeholder={placeholder}
                    {...register(name, validation)}>
                </input>

                {isInvalid && (Object.keys(inputError).length > 0) && (<InputError message={inputError.error} key={inputError.error}></InputError>)}
            </div>
        </div>

        </div >
    )
}