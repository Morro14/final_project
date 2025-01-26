import { useFormContext } from "react-hook-form"
import { findErrors, InputError, isFormInvalid } from "./InputError";

export const Input = ({ label, type, id, placeholder, validation, name }) => {
	const { register, formState: { errors } } = useFormContext();
	const isInvalid = isFormInvalid(errors);
	const inputError = findErrors(errors, name)
	console.log(label, inputError);
	console.log(isInvalid);
	return (
		<div className="input-container">
			<label className="input-label">
				{label}
			</label>
			<div className="input-inner">

				<input id={id}
					type={type}
					className="input-el"
					placeholder={placeholder}
					{...register(name, validation)}>
				</input>
				{isInvalid && (Object.keys(inputError).length > 0) && (<InputError message={inputError.error} key={inputError.error}></InputError>)}
			</div>
		</div>
	)
}