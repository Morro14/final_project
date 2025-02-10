export default function TableFilterEntities({
  label,
  name,
  options,
  type,
  id,
  selectHandle,
  disableTag,
  selectValue,
}) {
  let disableTagS = false;
  if (disableTag === "true") {
    disableTagS = true;
  }
  console.log("filterEnt", options);
  return (
    <div className="filter-select-container">
      <div className="filter-select-inner">
        <select
          id={id}
          type={type}
          className="filter-select-el table-select-el filter-entity-select"
          name={name}
          onChange={selectHandle}
          // defaultValue={options[0] ? options[0] : ""}
          disabled={disableTagS}
          value={selectValue}
        >
          {options.map((o, i) => {
            if (o.label === "нет фильтра") {
              return (
                <option key={"filter-opt-empty"} value="" id="filter-opt-empty">
                  {o.label}
                </option>
              );
            }

            return (
              <option key={"filter-opt-" + i} value={o.label} id={o.id}>
                {o.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
