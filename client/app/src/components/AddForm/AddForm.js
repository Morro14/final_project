import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { nameDict, textareaFields, choiceFields, dateFields, datetimeFields, categoryFieldToDetails } from "../../utils/names";
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
import { getOptions } from "../../utils/addFormFields";
import { useState, useEffect } from "react";
import { AddFormSuccess } from "./AddFormSuccess";


export async function formLoader({ params }) {
  const category = params.category;
  const data = await axios
    .get(serverURL + "/create/" + category)
    .then((r) => {

      return r;

    })
    .catch((r) => {
      if (r.status !== 200) {
        throw new Response("Not Found", { status: 404, statusText: r.response.statusText })
      }
    });
  const schemaData = await axios
    .options(serverURL + '/' + category + 's')
    .then((r) => {

      return r
    })
    .catch((r) => {
      if (r.status !== 200) {
        throw new Response("Not Found", { status: 404, statusText: r.response.statusText })
      }
    });
  return [data, schemaData];
}

export default function AddForm() {
  const methods = useForm();
  const client = useOutletContext().client
  const category = useParams("category").category;

  const [addSuccess, setAddSuccess] = useState()
  const [data, schemaData] = useLoaderData();
  const [formDataF, setFormDataF] = useState();
  console.log(addSuccess, formDataF)
  const userRef = data.data.user_ref.ref_type
  let options = getOptions(category, data.data, userRef)
  let formFields = Object.keys(schemaData.data.actions.POST)
  formFields = formFields.filter(e => e !== 'id')

  switch (userRef) {
    case 'client':
      formFields = formFields.filter(e => e !== 'client')
    case 'service_company' || 'service':
      formFields = formFields.filter(e => e !== 'service_company')
  }

  const onSubmit = methods.handleSubmit(formData => {
    console.log('handleSubmit', formData)
    setFormDataF(formData)

    switch (userRef) {
      case 'client':
        formData.client = data.data.user_ref.name
      case 'service_company' || 'service':
        formData.service_company = data.data.user_ref.name
    }

    axios
      .post(serverURL + '/create/' + category, formData)
      .then(r => {
        console.log('post response', r)
        if (r.status === 200) {
          setAddSuccess('200')

        }
      }
      )
      .catch((r) => {
        console.log('post error', r.status)
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
    const detailField = categoryFieldToDetails(field);

    if (textareaFields.includes(field)) {
      return (
        <TextArea
          label={nameDict[field]}
          type="text"
          id={field}
          key={"textarea" + field}
          maxLength={220}
          validation={inputValidation}
          name={field}

        ></TextArea>
      );
    } else if (choiceFields[category].includes(detailField)) {
      let optionsF = []
      if (detailField === 'machine') {
        optionsF = options.machines
      } else {
        optionsF = options[detailField]
      }
      const optionsMapped = optionsF

      return (
        <Select
          label={nameDict[field]}
          type="select"
          id={field}
          options={optionsMapped}
          name={field}
        >
        </Select>
      );
    } else if (dateFields.includes(detailField)) {
      return (
        <Input
          label={nameDict[field]}
          name={field}
          type="date_"
          id={field}
          placeholder={nameDict[field]}
          key={"inpt" + field}
          validation={dateValidationObj}

        ></Input>
      );
    } else if (datetimeFields.includes(detailField)) {
      return (
        <div className="datetime-el">{nameDict[field]}
          <div className="datetime-container">
            <DateTimeInput
              label={"Дата"}
              name={field + "-date"}
              type="date_"
              id={field + "-date"}
              placeholder="dd/mm/yyyy"
              key={"inpt" + field + "-date"}
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
  const errorMsg = addSuccess !== '200' ? 'Не удалось добавить данные' : ''


  return addSuccess === '200' ? (<AddFormSuccess formData={formDataF}></AddFormSuccess>) : (
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
