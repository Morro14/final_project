import { useFormContext } from "react-hook-form";
import { isFormInvalid, findErrors, InputError } from "./InputError";

export const TextArea = ({
  label,
  type,
  id,
  placeholder,
  validation,
  name,
  defaultData,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const isInvalid = isFormInvalid(errors);
  const inputError = findErrors(errors, name);
  return (
    <div className="input-container">
      <div className="input-label-container">
        <label className="input-label">{label}</label>
        <div className="input-inner">
          <textarea
            id={id}
            type={type}
            className="textarea-el"
            placeholder={placeholder}
            defaultValue={defaultData ? defaultData : ""}
            {...register(name, validation)}
          ></textarea>
          {isInvalid && Object.keys(inputError).length > 0 && (
            <InputError
              message={inputError.error}
              key={inputError.error}
            ></InputError>
          )}
        </div>
      </div>
    </div>
  );
};
