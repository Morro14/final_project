import { useNavigate } from "react-router-dom";



export const AddFormSuccess = () => {
    const navigate = useNavigate()
    function buttonFunction(e) {
        navigate('/dashboard');
    }
    // const { formData, category } = useAddFormCon()
    const data = localStorage.getItem('formData')

    const dataParsed = JSON.parse(data)

    const formData = dataParsed.data
    const category = dataParsed.category
    return (<>
        <button className="button" onClick={buttonFunction}>Вернуться</button>
        <h1>Данные успешно добавлены</h1>
        <h4>{category}</h4>
        <div>
            {Object.entries(formData).map(([k, v]) => (
                <div key={k + 'add-frm-scs-key'}>{`${k}: ${v}`}</div>
            )
            )
            }
        </div>
    </>
    )
}