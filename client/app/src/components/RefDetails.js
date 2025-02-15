import axios from "axios";
import { useLoaderData, useParams } from "react-router-dom";
import { serverURL } from "../App";
import { useNavigate } from "react-router-dom";

export async function refLoader({ params }) {
  const id = params.value;
  const refData = await axios

    .get(`${serverURL}/references/${id}`)
    .then((r) => {
      return r;
    })
    .catch((r) => {
      if (r.status !== 200) {
        throw new Response("Not Found", {
          status: 404,
          statusText: r.response.statusText,
        });
      }
    });

  const userData = await axios

    .get(`${serverURL}/dashboard`)
    .then((r) => {
      return r;
    })
    .catch((r) => {
      return "nonAuth";
    });
  return [refData, userData];
}

export default function RefDetials({ params }) {
  const { id } = useParams("id");
  const [refData, userData] = useLoaderData();

  const navigate = useNavigate();

  function buttonFunction(e) {
    navigate(-1);
  }
  function buttonChangeFunction() {
    navigate("/dashboard/edit/reference/" + refData.data.id);
  }
  const accessCheck =
    userData === "nonAuth" ? false : userData.data.user.user_type === "manager";
  return !refData.data ? (
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
      <h1>{refData.data.name}</h1>
      <p>{refData.data.description}</p>
      <div>
        {accessCheck ? (
          <div className="button ref-change-btn" onClick={buttonChangeFunction}>
            Изменить
          </div>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
