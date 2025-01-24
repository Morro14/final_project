import {
  redirect,
  useLoaderData,
  useOutlet,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { addFormFields } from "../details/names";
import { nameDict, textareaFields } from "../details/names";
import { Form } from "react-router-dom";
import "../styles/AddForm.css";
import axios from "axios";
import { serverURL } from "../App";
import { choiceFields } from "../details/names";
import { categoryFieldToDetails } from "../details/names";
import { useState } from "react";
import Select from "react-select";
import { useFetcher } from "react-router-dom";

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

export default function AddForm({ params }) {
  const category = useParams("category").category;
  const choices = useLoaderData().data;
  const client = useOutletContext().client;
  let fetcher = useFetcher();

  // const [inputs, setInputs] = useState({});
  // console.log("inputs", inputs);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   console.log(e.target);
  //   setInputs((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };
  // const handleSelect = (o, s) => {
  //   console.log("handleSelect", o, s);

  //   setInputs((prev) => ({
  //     ...(prev[o.ref_type] = o.option),
  //   }));
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   console.log("submit", inputs);
  // };

  const getField = (field) => {
    const detailField = categoryFieldToDetails(field);

    if (textareaFields.includes(field)) {
      return (
        <textarea
          // required
          maxLength={220}
          key={"add-form-inp-" + field}
          name={field}
        ></textarea>
      );
    } else if (choiceFields.includes(detailField)) {
      let options = [];

      choices.map((c) => {
        if (c.ref_type === detailField) {
          options.push(c);
        }
      });

      return (
        <select
          // required
          name={detailField}
          key={"add-form=slc=" + detailField}
          // onChange={(option, select) => handleSelect(option, select)}
        >
          {options.map((o) => (
            <option key={"add-form-opt" + o.id}>{o.name}</option>
          ))}
        </select>
      );
    } else {
      return (
        <input
          // required
          // onChange={handleChange}
          key={"add-form-inp-" + field}
          name={field}
        ></input>
      );
    }
  };

  return (
    <div className="add-form-container">
      <div className="add-form-title"></div>
      <Form
        className="add-form"
        method="post"
        action={"/dashboard/create/" + category}
      >
        {addFormFields[category].map((f) => (
          <div className="add-form-section" key={"add-form-section-" + f}>
            <label>{nameDict[f]}</label>
            {getField(f)}
          </div>
        ))}
        <button className="add-form-button button" type="submit">
          Добавить
        </button>
      </Form>
    </div>
  );
}

export async function action({ request }) {
  const formData = await request.formData();
  console.log(formData);

  // let category = new URL(request.url).searchParams.get("sorting");

  return redirect("/dashboard/create/report");
}
