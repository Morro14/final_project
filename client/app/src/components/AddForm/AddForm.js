import {
  useLoaderData,
  useParams,
  useNavigate
} from "react-router-dom";
import { nameDict, categoryFieldToRef } from "../../utils/names";
import { Form } from "react-router-dom";
import "../../styles/AddForm.css";
import axios from "axios";
import { serverURL } from "../../App";
import { FormProvider, useForm } from "react-hook-form";
import { Input } from "./form_components/Input";
import { DateTimeInput } from "./form_components/DateTimeInput";
import { TextArea } from "./form_components/TextArea";
import { Select } from "./form_components/Select";
import { dateValidationObj, inputValidation, timeValidationObj } from "./form_components/Validations";
import { getChoices } from "../../utils/formChoices";
import { useState } from "react";
import { formatDateTime, formatSchema } from "../../utils/formatting";



export async function formLoader({ params }) {
  const category = params.category;
  const data = category !== 'reference' ? await axios
    .get(serverURL + "/create/" + category)
    .then((r) => {

      return r;

    })
    .catch((r) => {
      if (r.status !== 200) {
        throw new Response("Not Found", { status: r.status, statusText: r.response.statusText })
      }
    }) : '';
  const schemaData = await axios
    .options(serverURL + '/' + category + 's')
    .then((r) => {

      return r
    })
    .catch((r) => {
      if (r.status !== 200) {
        throw new Response("Not Found", { status: r.status, statusText: r.response.statusText })
      }
    });
  return [data, schemaData];
}

export default function AddForm() {
  const methods = useForm();
  const navigate = useNavigate()
  const category = useParams("category").category;
  const [addSuccess, setAddSuccess] = useState('')
  const [data, schemaData] = useLoaderData();
  const userRef = category !== 'reference' ? data.data.user_ref.ref_type : 'Manager'
  const formattedSchemaData = formatSchema(schemaData.data.actions.POST, userRef)

  let options = getChoices(category, data.data, formattedSchemaData)

  let formFields = Object.keys(formattedSchemaData)




  const onSubmit = methods.handleSubmit(formData => {

    const formattedData = formatDateTime(formData)

    localStorage.setItem('formData', JSON.stringify({ data: formData, category: category }))

    switch (userRef) {
      case 'client':
        formattedData.client = data.data.user_ref.name
        break
      case 'service_company' || 'service':
        formattedData.service_company = data.data.user_ref.name
        break
    }


    axios
      .post(serverURL + '/create/' + category, formattedData)
      .then(r => {

        if (r.status === 200) {
          setAddSuccess('200')
          navigate('/dashboard/create/success')
        }
      }
      )
      .catch((r) => {
        window.scrollTo(0, 0)
        setAddSuccess('406')
      }
      )
  })


  const titleCategoty = {
    reclamation: "рекламации",
    maintenance: "техническом обслуживании",
    machine: "технике"
  }
  const getField = (field) => {

    const refField = categoryFieldToRef(field);
    if (formattedSchemaData[field].type === 'string' && formattedSchemaData[field].max_length > 120) {
      return (
        <TextArea
          label={nameDict[field]}
          type="text"
          id={field}
          key={"textarea_" + field}
          maxLength={220}
          validation={inputValidation}
          name={field}

        ></TextArea>
      );
    } else if (formattedSchemaData[field]['type'] === 'nested object' || formattedSchemaData[field]['type'] === 'field' ||
      formattedSchemaData[field]['type'] === 'choice'
    ) {

      let optionsF = options[field] ? options[field] : options[refField] || options['machines']
      return (
        <Select
          label={nameDict[field]}
          type="select"
          id={field}
          options={optionsF}
          name={field}
        >
        </Select>
      );
    } else if (formattedSchemaData[field]['type'] === 'date') {
      return (
        <Input
          label={nameDict[field]}
          name={field}
          type="date_"
          id={field}
          placeholder="YYYY-mm-dd"
          key={"inpt" + field}
          validation={dateValidationObj}

        ></Input>
      );
    } else if (formattedSchemaData[field]['type'] === 'datetime') {
      return (
        <div className="datetime-el">{nameDict[field]}
          <div className="datetime-container">
            <DateTimeInput
              label={"Дата"}
              name={field + "_date"}
              type="date_"
              id={field + "_date"}
              placeholder="YYYY-mm-dd"
              key={"inpt" + field + "_date"}
              validation={dateValidationObj}

            ></DateTimeInput>
            <DateTimeInput
              label={"Время"}
              name={field + "_time"}
              type="time_"
              id={field + "_time"}
              placeholder="hh:mm"
              key={"inpt" + field + "_time"}
              validation={timeValidationObj}

            ></DateTimeInput>
          </div>
        </div>
      );
    }

    else {
      return (
        <Input
          label={nameDict[field]}
          name={field}
          type="text"
          id={field}
          placeholder={nameDict[field]}
          key={"inpt" + field}
          validation={inputValidation}
        ></Input>
      );
    }
  };
  const errorMsg = addSuccess !== '' ? 'Не удалось добавить данные' : ''

  console.log('formFields', formFields)
  return (
    <div className="add-form-container">
      <h2 className="add-form-title">Добавить данные о {titleCategoty[category]}</h2>
      <h4 className="add-form-error-msg">{errorMsg}</h4>
      <FormProvider {...methods}>
        <Form
          onSubmit={e => e.preventDefault()}
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
    </div>
  );
}
