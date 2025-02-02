import { useNavigate } from "react-router-dom";


export const AddFormSuccess = ({ formData }) => {
    const navigate = useNavigate()
    function buttonFunction(e) {
        navigate('/dashboard');
    }
    return (<>
        <button className="button" onClick={buttonFunction}>Вернутся</button>
        <h1>Данные успешно добавлены</h1>

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