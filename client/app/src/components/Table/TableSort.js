import { useAuth } from "../Auth/AuthProvider";

export default function TableSort({
  label,
  name,
  options,
  type,
  id,
  selectHandle,
  disableTag,
}) {
  const auth = useAuth()
  const t = auth.translate
  return (
    <div className="sort-select-container nav-select-container">
      <div className="sort-select-inner">
        <select
          id={id}
          type={type}
          className="sort-select-el table-select-el"
          name={name}
          onChange={selectHandle}
          disabled={disableTag}
        >
          {options.map((o) => (
            <option key={"sort-opt" + o.id} value={o.id} id={o.id}>
              {t(o.name)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
