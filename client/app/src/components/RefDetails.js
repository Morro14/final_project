import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { serverURL } from "../App";
import { useNavigate } from "react-router-dom";

export async function refLoader({ params }) {
  console.log('ref param', params.value)
  const valueEnc = encodeURIComponent(params.value).replace(/%2F/g, "%252F");
  const data = await axios

    .get(`${serverURL}/references/${valueEnc}`)
    .then((r) => {
      return r;
    })
    .catch((r) => {
      if (r.status !== 200) {
        throw new Response("Not Found", { status: 404, statusText: r.response.statusText })
      }
    });
  return data;
}



export default function RefDetials({ params }) {
  const response = useLoaderData();
  const navigate = useNavigate();

  function buttonFunction(e) {
    navigate(-1);
  }
  function buttonChangeFunction() {
    navigate('/dashboard/edit/reference/' + response.data.name)
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
      <h1>{response.data.name}</h1>
      <p>{response.data.description}</p>
      <div className="button ref-change-btn" onClick={buttonChangeFunction}>Изменить</div>
    </>
  );
}
