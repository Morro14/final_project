import { createContext, useContext, useState } from "react";

const TableContext = createContext();

const TableConProvider = ({ children }) => {
  const [tableRef, setTableRef] = useState(null);

  return (
    <>
      <TableContext.Provider
        value={{
          tableRef,
          setTableRef,
        }}
      >
        {children}
      </TableContext.Provider>
    </>
  );
};
export default TableConProvider;

export const useTableCon = () => {
  return useContext(TableContext);
};
