import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { serverURL } from "../App";
import { useNavigate } from "react-router-dom";

export async function refLoader({ params }) {
  const data = await axios

    .get(`${serverURL}/details/${params.value}`)
    .then((r) => {
      return r;
    })
    .catch((e) => {
      return e;
    });
  return data;
}



export default function RefDetials({ params }) {
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
      <h1>{response.data.name}</h1>
      <p>{response.data.description}</p>
    </>
  );
}
