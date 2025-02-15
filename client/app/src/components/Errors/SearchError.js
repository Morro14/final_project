import {
  useRouteError,
  isRouteErrorResponse,
  useParams,
} from "react-router-dom";
import "../../styles/Errors.css";

export default function SearchErrorComp({ params }) {
  const error = useRouteError();
  const searchValue = useParams();
  console.log(searchValue);
  const statusTexts = {
    ERR_BAD_REQUEST: "Объект не найден",
    ERR_NETWORK: "Сервер не доступен",
  };
  if (isRouteErrorResponse(error)) {
    console.log("response error", error);
    return (
      <>
        <h2 className="error-title">
          Машины с заводским номером {searchValue.id} нет в системе
        </h2>
      </>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </div>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
