import { useFormContext } from "react-hook-form";

export const Select = ({ label, type, id, options, name, className, defaultData, category }) => {
    const { register } = useFormContext();
    let optionsChecked = true;
    if (!options) {
        optionsChecked = false
    }
    const setDefault = (opt) => {
        return opt === defaultData
    }
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
                        defaultValue={defaultData}
                        {...register(name)}>

                        {optionsChecked ? options.map((o) => {
                            const selectedValue = setDefault(o)
                            return <option key={"add-form-opt" + o.id} value={category !== 'reference' ? o.name : o.type} id={o.id}>{o.name}</option>
                        }) : <option value="not provided">нет данных</option>}
                    </select>
                </div>
            </div>
        </div>
    )
}