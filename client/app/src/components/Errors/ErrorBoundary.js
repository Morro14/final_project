import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import "../../styles/Errors.css";

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    console.log("response error");
    return (
      <>
        <h2 className="error-title">
          {error.status} {error.statusText}
        </h2>
        <p>{error.data}</p>
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
