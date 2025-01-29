import { Link } from "react-router-dom";
import { datetimeFields, dateFields, nameDict, linkNames } from "../../utils/names";
import { formatHeaders, formatRowData } from "../../utils/formatting";
import { useState } from "react";

export default function TableSorted({ params }) {
  const tabActive = params.tab;
  const sortedData = params.list;
  const headerLabel = (name_prev) => {
    return nameDict[name_prev];
  };

  const getLink = (key, value) => {
    const found = linkNames.find((k) => key === k);
    if (value === 'отсутствует') {
      return value;
    }
    else if (found) {
      const valueEnc = encodeURIComponent(value);
      return <Link to={`/details/${valueEnc}`}>{value}</Link>;
    } else if (key === "id_num") {
      const valueEnc = encodeURIComponent(value);
      return <Link to={`/details/machines/${valueEnc}`}>{value}</Link>;
    }
    return value;
  };
  const [scrollPosition, setScrollPosition] = useState('left')
  const handleScroll = (e) => {

    const { scrollLeft, scrollLeftMax } = e.target;
    // console.log(e.target)
    console.log(scrollLeft, scrollLeftMax)
    if (scrollLeft === 0) {
      setScrollPosition('left')
    } else if (scrollLeft === scrollLeftMax) {
      setScrollPosition('right')
    } else {
      setScrollPosition('middle')
    }

  }

  console.log(scrollPosition)
  const fadeClass = () => {
    switch (scrollPosition) {
      case 'left':
        return 'fade-right'
      case 'right':
        return 'fade-left'
    }
    return 'fade-sides'
  }

  return (
    <>
      <div className={`dashboard-table-container ${fadeClass()}`} onScroll={handleScroll}>
        <table className={`dashboard-table ${tabActive}-table table`}>
          <thead>
            <tr>
              {Object.entries(formatHeaders(sortedData[0])).map(([key, value]) => (
                <th key={`${tabActive}_th_` + key}>{headerLabel(key)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={`${tabActive}` + "_tr_" + item.id}>
                {Object.entries(formatRowData(item)).map(([key, field]) => (
                  <td key={`${tabActive}` + item.id + "_" + key}>
                    {getLink(key, field)}

                    {/* <div
                      className={"tooltip"}
                      key={`${tabActive}` + "_tlp_" + item.id + "_" + key}
                    >
                      {field}
                    </div> */}
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
