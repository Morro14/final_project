import { useFormContext } from "react-hook-form"

export const TextArea = ({ label, type, id, placeholder }) => {
    const { register } = useFormContext();
    return (
        <div className="input-container">
            <label className="input-label">
                {label}
            </label>
            <textarea id={id}
                type={type}
                className="textarea-el"
                placeholder={placeholder}
                {...register(label, { required: { value: true, message: 'required' } })}>
            </textarea>
        </div>
    )
}