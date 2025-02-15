export default function TableFilter({
  label,
  name,
  options,
  type,
  id,
  selectHandle,
  disableTag,
}) {
  // let disableCheck = "false";
  // if (!dataCheck) {
  //   disableCheck = "true";
  // }
  // console.log("category filter", options);
  return (
    <div className="filter-select-container">
      <div className="filter-select-inner">
        <select
          id={id}
          type={type}
          className="filter-select-el table-select-el"
          name={name}
          onChange={selectHandle}
          disabled={!disableTag}
        >
          <option value="">нет фильтра</option>
          {options.map((o) => (
            <option key={"filter-opt" + o.id} value={o.id} id={o.id}>
              {o.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
