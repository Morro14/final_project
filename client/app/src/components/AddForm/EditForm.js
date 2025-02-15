import { useLoaderData, useParams, useNavigate } from "react-router-dom";
import { nameDict, categoryFieldToRef } from "../../utils/names";
import { Form } from "react-router-dom";

import "../../styles/EditForm.css";
import axios from "axios";
import { serverURL } from "../../App";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "./form_components/Input";
import { DateTimeInput } from "./form_components/DateTimeInput";
import { TextArea } from "./form_components/TextArea";
import { Select } from "./form_components/Select";
import {
  dateValidationObj,
  inputValidation,
  timeValidationObj,
} from "./form_components/Validations";
import { getChoices } from "../../utils/formChoices";
import { useState } from "react";
import { formatDateTime, formatSchema } from "../../utils/formatting";

export async function editFormLoader({ params }) {
  const category = params.category;
  const id = params.id;
  // load select options

  const dataOptions =
    category !== "reference"
      ? await axios
          .get(serverURL + "/create/" + category)
          .then((r) => {
            console.log(r);
            return r;
          })
          .catch((r) => {
            if (r.status !== 200) {
              throw new Response("Not Found", {
                status: r.status,
                statusText: r.response.statusText,
              });
            }
          })
      : null;
  // load current object data
  const data = await axios
    .get(serverURL + "/" + category + "s/" + id)
    .then((r) => {
      return r;
    })
    .catch((r) => {
      if (r.status !== 200) {
        throw new Response("Not Found", {
          status: r.status,
          statusText: r.response.statusText,
        });
      }
    });
  //load schema
  const schemaData = await axios
    .options(serverURL + "/" + category + "s")
    .then((r) => {
      return r;
    })
    .catch((r) => {
      if (r.status !== 200) {
        throw new Response("Not Found", {
          status: r.status,
          statusText: r.response.statusText,
        });
      }
    });
  return [data, schemaData, dataOptions];
}

export default function EditForm() {
  const methods = useForm();
  const navigate = useNavigate();
  const category = useParams("category").category;
  const [addSuccess, setAddSuccess] = useState("");
  const [data, schemaData, dataOptions] = useLoaderData();
  const optionsData = category !== "reference" ? dataOptions.data : null;
  const id = data.data.id;
  const userRef = "Manager";
  const formattedSchemaData = formatSchema(
    schemaData.data.actions.POST,
    userRef
  );

  let options = getChoices(category, optionsData, formattedSchemaData);

  let formFields = Object.keys(formattedSchemaData);

  const onSubmit = methods.handleSubmit((formData) => {
    const formattedData = formatDateTime(formData);
    formData["id"] = id;
    localStorage.setItem(
      "formData",
      JSON.stringify({ data: formData, category: category })
    );

    axios
      .patch(serverURL + "/edit/" + category + "/" + id, formattedData)
      .then((r) => {
        if (r.status === 200) {
          setAddSuccess("200");
          navigate("/dashboard/create/success");
        }
      })
      .catch((r) => {
        window.scrollTo(0, 0);
        setAddSuccess("406");
      });
  });

  const titleCategoty = {
    reclamation: "рекламации",
    maintenance: "техническом обслуживании",
    machine: "технике",
  };
  const getField = (field) => {
    const refField = categoryFieldToRef(field);
    if (
      formattedSchemaData[field].type === "string" &&
      formattedSchemaData[field].max_length > 120
    ) {
      const defaultValue = data.data[refField] ? data.data[refField] : "";
      return (
        <TextArea
          label={nameDict[field]}
          type="text"
          id={field}
          key={"textarea_" + field}
          maxLength={220}
          validation={inputValidation}
          name={field}
          defaultData={defaultValue}
        ></TextArea>
      );
    } else if (
      formattedSchemaData[field]["type"] === "nested object" ||
      formattedSchemaData[field]["type"] === "field" ||
      formattedSchemaData[field]["type"] === "choice"
    ) {
      let optionsF = options[field]
        ? options[field]
        : options[refField] || options["machines"];
      const defaultValue = data.data[field] ? data.data[field].name : null;
      return (
        <Select
          label={nameDict[field]}
          type="select"
          id={field}
          options={optionsF}
          name={field}
          defaultData={defaultValue}
        ></Select>
      );
    } else if (formattedSchemaData[field]["type"] === "date") {
      const defaultValue = data.data[refField] ? data.data[refField] : "";
      return (
        <Input
          label={nameDict[field]}
          name={field}
          type="date_"
          id={field}
          placeholder="YYYY-mm-dd"
          key={"inpt" + field}
          validation={dateValidationObj}
          defaultData={defaultValue}
        ></Input>
      );
    } else if (formattedSchemaData[field]["type"] === "datetime") {
      const defaultValue = data.data[refField] ? data.data[refField] : "";
      return (
        <div className="datetime-el">
          {nameDict[field]}
          <div className="datetime-container">
            <DateTimeInput
              label={"Дата"}
              name={field + "_date"}
              type="date_"
              id={field + "_date"}
              placeholder="YYYY-mm-dd"
              key={"inpt" + field + "_date"}
              validation={dateValidationObj}
              defaultData={defaultValue}
            ></DateTimeInput>
            <DateTimeInput
              label={"Время"}
              name={field + "_time"}
              type="time_"
              id={field + "_time"}
              placeholder="hh:mm"
              key={"inpt" + field + "_time"}
              validation={timeValidationObj}
              defaultData={defaultValue}
            ></DateTimeInput>
          </div>
        </div>
      );
    } else {
      const defaultValue = data.data[refField] ? data.data[refField] : "";
      return (
        <Input
          label={nameDict[field]}
          name={field}
          type="text"
          id={field}
          placeholder={nameDict[field]}
          key={"inpt" + field}
          validation={inputValidation}
          defaultData={defaultValue}
        ></Input>
      );
    }
  };
  const errorMsg = addSuccess !== "" ? "Не удалось добавить данные" : "";
  const [displayValue, setDisplayValue] = useState("modal-hide");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const buttonGetModal = () => {
    setDisplayValue("modal-display");
  };
  const closeButton = () => {
    setDisplayValue("modal-hide");
  };
  function buttonNavFunction(e) {
    navigate("/dashboard");
  }
  const deleteModalWidnow = () => {
    return (
      <div className={`modal ${displayValue}`}>
        <div className={`modal-content`}>
          <span onClick={closeButton} className="close">
            &times;
          </span>
          <p className="modal-text">Вы действительно хотите удалить данные?</p>
          <button
            className="button delete-confirm-button"
            onClick={(e) => buttonDeleteFunction(id)}
          >
            Подтвердить
          </button>
        </div>
      </div>
    );
  };
  async function buttonDeleteFunction() {
    await axios
      .delete(serverURL + "/references/" + id, { id: id })
      .then((r) => {
        setDeleteSuccess(true);
      })
      .catch((r) => {
        if (r.status !== 200) {
          throw new Response("Not Found", {
            status: 404,
            statusText: r.response.statusText,
          });
        }
      });
  }
  return deleteSuccess ? (
    <>
      <button className="button" onClick={buttonNavFunction}>
        Вернуться
      </button>
      <h1>Данные успешно удалены</h1>
      <h4>{category}</h4>
      <div>
        {Object.entries(data.data).map(([k, v]) => (
          <div key={"row-" + k}>{k + ": " + v}</div>
        ))}
      </div>
    </>
  ) : (
    <div className="add-form-container">
      <h2 className="add-form-title">
        Добавить данные о {titleCategoty[category]}
      </h2>
      <h4 className="add-form-error-msg">{errorMsg}</h4>
      <FormProvider {...methods}>
        <Form
          onSubmit={(e) => e.preventDefault()}
          className="add-form"
          noValidate
        >
          {formFields.map((f) => (
            <div className="add-form-section" key={"add-form-section-" + f}>
              {getField(f)}
            </div>
          ))}

          <button className="add-form-button button" onClick={onSubmit}>
            Добавить
          </button>
        </Form>
      </FormProvider>
      <button
        className="delete-button button"
        onClick={(e) => buttonGetModal(setDisplayValue)}
      >
        Удалить
      </button>
      {deleteModalWidnow(displayValue, id)}
    </div>
  );
}
