export default function TableSort({ label, name, options, type, id, selectHandle }) {

    return (
        <div className="sort-select-container nav-select-container">
            <div className="sort-label-container nav-label-container">
                <label className="sort-label nav-label">
                    {label}
                </label>
                <div className="sort-select-inner">
                    <select id={id}
                        type={type}
                        className="sort-select-el"
                        name={name}
                        onChange={selectHandle}
                    >
                        {options.map((o) => (
                            <option key={"sort-opt" + o.id} value={o.id} id={o.id}>{o.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}