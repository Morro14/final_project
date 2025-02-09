import { useRouteError, isRouteErrorResponse } from "react-router-dom";
import "../../styles/Errors.css";
export default function ErrorComp() {
  const error = useRouteError();
  console.log("error", error);
  const statusTexts = {
    ERR_BAD_REQUEST: "Объект не найден",
    ERR_NETWORK: "Сервер не доступен",
  };
  if (isRouteErrorResponse(error)) {
    console.log("response error", error);
    return (
      <>
        <h2 className="error-title">
          Ошибка {error.status} {error.statusText}
        </h2>
        <p>Не удалось получить данные</p>
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
