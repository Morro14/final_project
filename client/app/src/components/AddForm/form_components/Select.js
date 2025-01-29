import { useFormContext } from "react-hook-form";

export const Select = ({ label, type, id, options, name, className }) => {
    const { register } = useFormContext();
    return (
        <div className={`input-container`}>
            <div className={`input-label-container`}>
                <label className={`input-label`}>
                    {label}
                </label>
                <div className={`input-inner`}>
                    <select id={id}
                        type={type}
                        className={`select-el`}
                        name={name}

                        {...register(name, { required: { value: true, message: 'required' } })}>

                        {options.map((o) => (
                            <option key={"add-form-opt" + o.id} value={o.id} id={o.id}>{o.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}