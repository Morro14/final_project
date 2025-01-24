import { Link } from "react-router-dom";
import { nameDict } from "../details/names";

export default function TableSorted({ params }) {
  const tabActive = params.tab;
  const sortedList = params.list;
  const keyNames = (name_prev) => {
    return nameDict[name_prev];
  };

  const getLink = (key, value) => {
    const keysArray = [
      "model",
      "engine_model",
      "main_bridge_model",
      "steerable_bridge_model",
      "transmission_model",
      "type",
      "service_company",
      "recovery_method",
      "failure_node",
    ];

    const found = keysArray.find((k) => key === k);

    if (found) {
      const valueEnc = encodeURIComponent(value);
      return <Link to={`/details/${valueEnc}`}>{value}</Link>;
    } else return value;
  };

  const removeId = (o) => {
    const { id, sorting_fields, ...rest } = o;
    return rest;
  };
  return (
    <>
      <div className="dashboard-table-container">
        <table className={`dashboard-table ${tabActive}-table table`}>
          <thead>
            <tr>
              {Object.entries(removeId(sortedList[0])).map(([key, value]) => (
                <th key={`${tabActive}_th_` + key}>{keyNames(key)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.values(sortedList).map((item) => (
              <tr key={`${tabActive}` + "_tr_" + item.id}>
                {Object.entries(removeId(item)).map(([key, field]) => (
                  <td key={`${tabActive}` + item.id + "_" + key}>
                    {getLink(key, field)}

                    <div
                      className={"tooltip"}
                      key={`${tabActive}` + "_tlp_" + item.id + "_" + key}
                    >
                      {field}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
