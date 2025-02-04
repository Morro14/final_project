import { Link } from "react-router-dom";
import { datetimeFields, dateFields, linkNames, nameDict } from "./names";


// format data for table headers
export const formatHeaders = (data) => {

    const { id, sorting_fields, ...rest } = data;
    return rest;
}

// format data for table rows
export const formatRowData = (data) => {
    const { id, sorting_fields, ...rest } = data;
    Object.keys(rest).find(k => {
        if (datetimeFields.includes(k)) {
            rest[k] = new Date(rest[k]).toLocaleDateString() + ' ' + new Date(rest[k]).toLocaleTimeString()
        }
        if (dateFields.includes(k)) {
            rest[k] = new Date(rest[k]).toLocaleDateString()
        }
        const val = rest[k]

        if (val !== 'edit' && nameDict[val]) {
            const val = rest[k]
            rest[k] = nameDict[val]
        }

    })
    let formatted = {}

    Object.keys(rest).map((k) => {
        if (!rest[k]) {
            formatted[k] = "отсутствует"
        }
        else if (k !== 'edit' && typeof (rest[k]) === "object") {
            formatted[k] = rest[k]["name"] ? rest[k]["name"] : rest[k]["id_num"]
        }
        else {
            formatted[k] = rest[k]
        }
    })
    return formatted;
};


// render links if the value is in "linkNames"
export const getLink = (key, value) => {
    const found = linkNames.find((k) => key === k);
    if (value === 'отсутствует') {
        return value;
    } else if (key === "machine") {

        const valueEnc = encodeURIComponent(value).replace(/%2F/g, "%252F");

        return <Link to={`/details/machines/${valueEnc}`}>{value}</Link>;
    } else if (key === 'edit') {

        const valueEnc = encodeURIComponent(value.slug).replace(/%2F/g, "%252F");
        return <Link to={'/dashboard/edit/reference/' + valueEnc}>{value.name}</Link>
    }
    else if (found) {
        const valueEnc = encodeURIComponent(value).replace(/%2F/g, "%252F");
        return <Link to={`/details/${valueEnc}`}>{value}</Link>;
    }
    return value;
};

//combine date and time fields in the form data 
export const formatDateTime = (data) => {
    datetimeFields.forEach(f => {
        const dateField = f + '_date'
        const timeField = f + '_time'
        if (!data[timeField]) {
            return data
        }
        const datetimeField = data[timeField] === '' ? data[dateField] : data[dateField] + ' ' + data[timeField]
        delete data[dateField]
        delete data[timeField]
        data[f] = datetimeField
    })
    return data
}


// remove read-only fields from the API schema data
export const formatSchema = (data, userRef) => {
    let formattedData = data
    Object.keys(data).forEach((e) => {
        if (data[e].read_only === true) {
            delete formattedData[e]
        }
    })
    console.log('userRef', userRef)
    switch (userRef) {
        case 'client':
            delete formattedData['client']
            break
        case 'service':
            console.log('test')
            if (formattedData['service_company']) {
                delete delete formattedData['service_company']
            }
            if (formattedData['mt_comapny']) {
                delete delete formattedData['mt_company']
            }
            break



    }
    return formattedData
}

