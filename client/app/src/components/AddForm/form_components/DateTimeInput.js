import { useFormContext } from "react-hook-form"
import { findErrors, InputError, isFormInvalid } from "./InputError";

export const DateTimeInput = ({ label, type, id, placeholder, validation, name }) => {
    const { register, formState: { errors } } = useFormContext();
    const isInvalid = isFormInvalid(errors);
    const inputError = findErrors(errors, name)

    return (
        <div className="input-container">
            <div className={"input-label-container datetime-label-container" + " " + type + "-label-container"}>
                <label className="input-label datetime-label">
                    {label}
                </label>
                <div className="input-inner">

                    <input id={id}
                        type={type}
                        className={`input-datetime-date ${type}`}
                        placeholder={placeholder}
                        {...register(name,)}>
                    </input>

                    {isInvalid && (Object.keys(inputError).length > 0) && (<InputError message={inputError.error} key={inputError.error}></InputError>)}
                </div>
            </div>

        </div>
    )
}