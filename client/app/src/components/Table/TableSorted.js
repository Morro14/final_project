import { Link } from "react-router-dom";
import { datetimeFields, dateFields, nameDict, linkNames } from "../../utils/names";
import { formatHeaders, formatRowData, getLink } from "../../utils/formatting";
import { useState } from "react";
import '../../styles/Table.css'

export default function TableSorted({ params }) {
  const tabActive = params.tab;
  const sortedData = params.list;
  const headerLabel = (name_prev) => {
    return nameDict[name_prev];
  };


  const [scrollPosition, setScrollPosition] = useState('left')
  const handleScroll = (e) => {

    const { scrollLeft, scrollLeftMax } = e.target;
    // console.log(e.target)

    if (scrollLeft === 0) {
      setScrollPosition('left')
    } else if (scrollLeft === scrollLeftMax) {
      setScrollPosition('right')
    } else {
      setScrollPosition('middle')
    }

  }


  const fadeClass = () => {
    switch (scrollPosition) {
      case 'left':
        return 'fade-right'
      case 'right':
        return 'fade-left'
    }
    return 'fade-sides'
  }
  return !sortedData[0] ? (
    <div>Нет Данных</div>
  ) : (
    <>
      <div className={`table-container ${fadeClass()}`} onScroll={handleScroll}>
        <table className={`table-inner ${tabActive}-table table`}>
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
