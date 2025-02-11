import { Link } from "react-router-dom";
import { datetimeFields, dateFields, linkNames, nameDict } from "./names";

// format data for table headers
export const formatHeaders = (data) => {
  const { id, sorting_fields, ...rest } = data;
  return rest;
};

// format data for table rows
export const formatRowData = (data) => {
  const { id, sorting_fields, ...rest } = data;

  Object.keys(rest).forEach((k) => {
    if (datetimeFields.includes(k)) {
      rest[k] =
        new Date(rest[k]).toLocaleDateString() +
        " " +
        new Date(rest[k]).toLocaleTimeString();
    }
    if (dateFields.includes(k)) {
      rest[k] = new Date(rest[k]).toLocaleDateString();
    }
    const val = rest[k];

    if (val !== "edit" && nameDict[val]) {
      const val = rest[k];
      rest[k] = nameDict[val];
    }
  });
  let formatted = {};

  Object.keys(rest).map((k) => {
    if (!rest[k]) {
      formatted[k] = { label: "отсутствует", type: k };
    } else if (typeof rest[k] === "object") {
      formatted[k] = {
        type: k,
        label: rest[k]["name"] ? rest[k]["name"] : rest[k]["id_num"],
        id: rest[k]["id"],
      };
    } else {
      formatted[k] = { type: k, label: rest[k], id: data["id"] };
    }
  });
  return formatted;
};

// render links if the value is in "linkNames"
export const getLink = (key, field) => {
  const found = linkNames.find((k) => key === k);
  if (field.label === "отсутствует") {
    return field.label;
  } else if (key === "machine") {
    return <Link to={`/details/machines/${field.label}`}>{field.label}</Link>;
  } else if (key === "edit") {
    return <Link to={"/dashboard/edit/reference/" + field.id}>{"ред."}</Link>;
  } else if (found) {
    return <Link to={`/details/${field.id}`}>{field.label}</Link>;
  }
  return field.label;
};

//combine date and time fields in the form data
export const formatDateTime = (data) => {
  datetimeFields.forEach((f) => {
    const dateField = f + "_date";
    const timeField = f + "_time";
    if (!data[timeField]) {
      return data;
    }
    const datetimeField =
      data[timeField] === ""
        ? data[dateField]
        : data[dateField] + " " + data[timeField];
    delete data[dateField];
    delete data[timeField];
    data[f] = datetimeField;
  });
  return data;
};

// remove read-only fields from the API schema data
export const formatSchema = (data, userRef) => {
  let formattedData = data;
  Object.keys(data).forEach((e) => {
    if (data[e].read_only === true) {
      delete formattedData[e];
    }
  });
  switch (userRef) {
    case "client":
      delete formattedData["client"];
      break;
    case "service":
      if (formattedData["service_company"]) {
        delete delete formattedData["service_company"];
      }
      if (formattedData["mt_comapny"]) {
        delete delete formattedData["mt_company"];
      }
      break;
  }
  return formattedData;
};
