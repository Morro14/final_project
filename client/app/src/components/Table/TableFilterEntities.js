export default function TableFilterEntities({
  label,
  name,
  options,
  type,
  id,
  selectHandle,
  disableTag,
}) {
  let disableTagS = false;
  if (disableTag === "true") {
    disableTagS = true;
  }
  console.log("ent", options);
  return (
    <div className="filter-select-container">
      <div className="filter-select-inner">
        <select
          id={id}
          type={type}
          className="filter-select-el table-select-el filter-entity-select"
          name={name}
          onChange={selectHandle}
          defaultValue={options[0] ? options[0] : ""}
          disabled={disableTagS}
        >
          {options.map((o) => {
            if (o.name === "нет фильтра") {
              return (
                <option key={"filter-opt-" + o.id} value="" id={o.name.label}>
                  {o.name}
                </option>
              );
            }
            return (
              <option
                key={"filter-opt-" + o.id}
                value={o.name.label}
                id={o.name.id}
              >
                {o.name.label}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
