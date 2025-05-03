import { useAuth } from "../Auth/AuthProvider";

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
  const auth = useAuth()
  const t = auth.translate
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
          <option value="">{t('noFilter')}</option>
          {options.map((o) => (
            <option key={"filter-opt" + o.id} value={o.id} id={o.id}>
              {t(o.name)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
