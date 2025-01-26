import {
  redirect,
  useLoaderData,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { addFormFields } from "../details/names";
import { nameDict, textareaFields } from "../details/names";
import { Form } from "react-router-dom";
import "../styles/AddForm.css";
import axios from "axios";
import { serverURL } from "../App";
import { choiceFields } from "../details/names";
import { categoryFieldToDetails } from "../details/names";

import { FormProvider, useForm } from "react-hook-form";
import { Input } from "./form_components/Input";
import { TextArea } from "./form_components/TextArea";
import { Select } from "./form_components/Select";
import { inputValidation } from "./form_components/Validations";

export async function formLoader() {
  const data = axios
    .get(serverURL + "/details")
    .then((r) => {
      return r;
    })
    .catch((e) => {
      return e;
    });
  return data;
}

export default function AddForm() {
  const methods = useForm();
  const onSubmit = methods.handleSubmit(data => {
    console.log(data)
  })
  const category = useParams("category").category;
  const choices = useLoaderData().data;
  const client = useOutletContext().client;
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
          placeholder={nameDict[field]}
          key={"textarea" + field}
          maxLength={220}

        ></TextArea>
      );
    } else if (choiceFields.includes(detailField)) {

      let options = [];

      choices.map((c) => {
        if (c.ref_type === detailField) {
          options.push(c);
        }
      });

      return (
        <Select
          label={nameDict[field]}
          type="select"
          id={field}
          options={options}
          name={field}
        >
          {options.map((o) => (
            <option key={"add-form-opt" + o.id}>{o.name}</option>
          ))}
        </Select>
      );
    } else {
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

  return (
    <div className="add-form-container">
      <h2 className="add-form-title">Добавить данные о {titleCategoty[category]}</h2>
      <FormProvider {...methods}>
        <Form
          onSubmit={e => e.preventDefault()}
          className="add-form"
          noValidate
        >
          {addFormFields[category].map((f) => (
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

// export async function action({ request }) {
//   const formData = await request.formData();
//   console.log(formData);

//   // let category = new URL(request.url).searchParams.get("sorting");

//   return redirect("/dashboard/create/report");
// }
