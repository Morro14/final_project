


export default function TableFilterEntities({ label, name, options, type, id, selectHandle }) {

    return (
        <div className="filter-select-container">
            <div className="filter-label-container nav-label-container">
                <label className="filter-label nav-label">
                    {label}
                </label>
                <div className="filter-select-inner">
                    <select id={id}
                        type={type}
                        className="filter-select-el table-select-el"
                        name={name}
                        onChange={selectHandle}
                        defaultValue={options[0] ? options[0] : ''}
                    >

                        {options.map((o) => (

                            <option key={"filter-opt" + o.id} value={o.name} id={o.id}>{o.name}</option>
                        ))}
                    </select>

                </div>
            </div>
        </div>
    )
}