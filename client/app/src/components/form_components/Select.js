import { useFormContext } from "react-hook-form"

export const Select = ({ label, type, id, options, name }) => {
    const { register } = useFormContext();
    return (
        <div className="input-container">
            <label className="input-label">
                {label}
            </label>
            <select id={id}
                type={type}
                className="select-el"
                name={name}

                {...register(name, { required: { value: true, message: 'required' } })}>

                {options.map((o) => (
                    <option key={"add-form-opt" + o.id}>{o.name}</option>
                ))}
            </select>
        </div>
    )
}