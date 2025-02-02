import { createContext, useContext, useState } from "react";

const TableContext = createContext()

const TableConProvider = ({ children }) => {
    const [filterCategory, setFilterCategory] = useState('');
    const [filterEntity, setFilterEntity] = useState('');
    const [sorting, setSorting] = useState();
    return <>
        <TableContext.Provider value={{ filterCategory, filterEntity, sorting, setFilterCategory, setFilterEntity, setSorting }}>{children}</TableContext.Provider>
    </>
}
export default TableConProvider;

export const useTableCon = () => {
    return useContext(TableContext);
};