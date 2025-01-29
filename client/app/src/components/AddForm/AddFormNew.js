import {
    redirect,
    useLoaderData,
    useOutletContext,
    useParams,
  } from "react-router-dom";
  import { nameDict, textareaFields, choiceFields, dateFields, datetimeFields, addFormFields, categoryFieldToDetails } from "../../details/names";
  import { Form } from "react-router-dom";
  import "../styles/AddForm.css";
  import axios from "axios";
  import { serverURL } from "../../App";
  
  
  import { FormProvider, useForm } from "react-hook-form";
  import { Input } from "./form_components/Input";
  import { TextArea } from "./form_components/TextArea";
  import { Select } from "./form_components/Select";
  import { dateValidationObj, inputValidation, timeValidationObj } from "./form_components/Validations";
  
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
    const client = useOutletContext().client;
    const category = useParams("category").category;
    const onSubmit = methods.handleSubmit(data => {
      console.log(data)
      data.client = client.id;
      axios.post(serverURL + '/create/' + category, data)
    })
    const choices = useLoaderData().data;
  
    const titleCategoty = {
      reclamation: "рекламации",
      maintenance: "техническом обслуживании",
      machine: "технике"
    }
  
    
  
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
  