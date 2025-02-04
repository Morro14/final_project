import { FormProvider, useForm } from "react-hook-form"
import { Input } from "./form_components/Input";
import { Form } from "react-hook-form";
import axios from "axios";
import { useLoaderData, useOutletContext, useParams } from "react-router-dom";
import { serverURL } from "../../App";
import { Select } from "./form_components/Select";
import { formatSchema, formatDateTime } from "../../utils/formatting";
import { nameDict } from "../../utils/names";
import { inputValidation } from "./form_components/Validations";
import { getChoices } from "../../utils/formChoices";
import { TextArea } from "./form_components/TextArea";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../styles/EditForm.css'


export async function refEditLoader({ params }) {

    const category = params.category;
    const id = params.id
    const data = await axios
        .get(serverURL + "/references/" + id)
        .then((r) => {
            console.log('edit', r)
            return r;
        })
        .catch((r) => {
            if (r.status !== 200) {
                throw new Response("Not Found", { status: r.status, statusText: r.response.statusText })
            }
        });

    const schemaData = await axios
        .options(serverURL + "/references/")
        .then((r) => {
            console.log('schema edit', r)
            return r;
        })
        .catch((r) => {
            if (r.status !== 200) {
                throw new Response("Not Found", { status: r.status, statusText: r.response.statusText })
            }
        });
    return [data, schemaData]
}

export const EditForm = () => {
    const navigate = useNavigate()
    const { category } = useParams('category')
    // id = name (change later)
    const { id } = useParams('id')
    const user = useOutletContext().user
    const methods = useForm();
    const [data, schemaData] = useLoaderData()
    const schema = schemaData.data.actions.POST
    const userRef = user.user_ref
    // get form fields
    const formattedSchema = formatSchema(schema, user.user_ref)
    const formFields = Object.keys(formattedSchema)
    console.log('formFields', formFields)
    // get select options
    const options = getChoices(category, data, formattedSchema)
    console.log('options', options)
    // ref data
    const refData = data.data
    // set success status
    const [addSuccess, setAddSuccess] = useState('')
    // handle submit
    const onSubmit = methods.handleSubmit(formData => {
        const formattedData = formatDateTime(formData)
        // add old name in case the name is changed
        formData['name_prev'] = refData.name
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
            .patch(serverURL + '/edit/' + category + "/" + id, formattedData)
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
    // render field
    const getField = (field) => {
        if (formattedSchema[field]["type"] === 'string' && formattedSchema[field]["max_length"] <= 120) {
            let defaultData = refData[field]
            console.log('input default data', defaultData)
            return <Input
                label={nameDict[field]}
                name={field}
                type='text'
                id={field}
                key={'inpt_' + field}
                validation={inputValidation}
                defaultData={defaultData}
            ></Input>
        } else if (formattedSchema[field]["max_length"] > 120) {
            let defaultData = refData[field]
            return <TextArea
                label={nameDict[field]}
                name={field}
                type='textarea'
                id={field}
                key={'textarea_' + field}
                max_length={200}
                validation={inputValidation}
                defaultData={defaultData}

            ></TextArea>
        }

        else if (formattedSchema[field]['type'] = 'choice') {
            let optionsF = options[field]
            let defaultData = nameDict[refData[field]]
            console.log('select default', defaultData)
            return <Select
                label={nameDict[field]}
                type="select"
                id={field}
                options={optionsF}
                name={field}
                defaultData={defaultData}
                category={category}
            ></Select>
        }
    }
    const errorMsg = addSuccess !== '' ? 'Не удалось добавить данные' : ''
    return (<div className="edit-form-main">
        <h2 className="add-form-title">Изменить справочные данные</h2>
        <h4 className="add-form-error-msg">{errorMsg}</h4>
        <FormProvider {...methods}>
            <Form
                onSubmit={e => e.preventDefault()}
                noValidate
            >
                {formFields.map((f) => (
                    <div className="edit-form-section" key={"edit-form-section-" + f}>

                        {getField(f)}
                    </div>
                ))}
                <button className="add-form-button button" onClick={onSubmit}>
                    Добавить
                </button>
            </Form>
        </FormProvider>
    </div>)
}