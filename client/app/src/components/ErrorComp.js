export default function ErrorComp(params) {
  let status = "";
  console.log(params);
  if (params.response.code) {
    status = params.response.code;
  }

  const statusTexts = {
    ERR_BAD_REQUEST: "Объект не найден",
    ERR_NETWORK: "Сервер не доступен",
  };
  return (
    <>
      <h2>Ошибка. {statusTexts[status]}</h2>
    </>
  );
}
