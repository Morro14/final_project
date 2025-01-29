import { Link } from "react-router-dom";
import { datetimeFields, dateFields } from "./names";

export const formatHeaders = (data) => {
    // format data for table headers
    const { id, sorting_fields, ...rest } = data;
    return rest;
}

export const formatRowData = (data) => {
    // format data for table rows
    const { id, sorting_fields, ...rest } = data;


    Object.keys(rest).find(k => {
        if (datetimeFields.includes(k)) {
            rest[k] = new Date(rest[k]).toLocaleDateString() + ' ' + new Date(rest[k]).toLocaleTimeString()
        }
        if (dateFields.includes(k)) {
            rest[k] = new Date(rest[k]).toLocaleDateString()
        }
    })
    let formatted = {}
    Object.keys(rest).map((k) => {
        if (!rest[k]) {
            formatted[k] = "отсутствует"
        }
        else if (typeof (rest[k]) === "object") {
            formatted[k] = rest[k]["name"] ? rest[k]["name"] : rest[k]["id_num"]
        }
        else {
            formatted[k] = rest[k]
        }
    })
    return formatted;
};

export const getLink = (key, value, namesList) => {
    // render links if the value is in "namesList"
    const found = namesList.find((k) => key === k);
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