import { useNavigate, useLoaderData } from "react-router-dom";
import { serverURL } from "../App";
import axios from "axios";



export async function machineLoader({ params }) {
    const data = await axios

        .get(`${serverURL}/machines/${params.value}`)
        .then((r) => {
            console.log(r);
            return r;
        })
        .catch((r) => {
            if (r.status !== 200) {
                console.log(r)
                throw new Response("Not Found", { status: 404, statusText: r.response.statusText })
            }
        });
    return data;
}

export default function MachineDetials({ params }) {
    const response = useLoaderData();
    const navigate = useNavigate();

    function buttonFunction(e) {
        navigate(-1);
    }

    return !response.data ? (
        <>
            <div className="button ref-back-btn" onClick={buttonFunction}>
                Вернуться к таблице
            </div>
            <p>Не удалось найти данные об объекте</p>
        </>
    ) : (
        <>
            <div className="button ref-back-btn" onClick={buttonFunction}>
                Вернуться к таблице
            </div>
            <h1>{response.data.id_num}</h1>
            <p>{response.data.model.name}</p>
        </>
    );
}