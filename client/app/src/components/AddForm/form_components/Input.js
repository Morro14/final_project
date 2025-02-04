import { useFormContext } from "react-hook-form"
import { findErrors, InputError, isFormInvalid } from "./InputError";

export const Input = ({ label, type, id, placeholder, validation, name, defaultData }) => {
	const { register, formState: { errors } } = useFormContext();
	const isInvalid = isFormInvalid(errors);
	const inputError = findErrors(errors, name)
	const placeholderVar = type === 'date_' ? placeholder : ''
	return (
		<div className="input-container">
			<div className="input-label-container">
				<label className="input-label">
					{label}
				</label>
				<div className="input-inner">

					<input id={id}
						type={type}
						className={`input-el ${type}`}
						placeholder={placeholderVar}
						defaultValue={defaultData}
						{...register(name, validation)}>
					</input>
					{isInvalid && (Object.keys(inputError).length > 0) && (<InputError message={inputError.error} key={inputError.error}></InputError>)}
				</div>
			</div>

		</div>
	)
}