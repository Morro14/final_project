export const nameDict = {
  engine_id: "Зав.№ двигателя",
  engine_model: "Модель двигателя",
  id_num: "Заводской номер машины",
  main_bridge_id: "Зав.№ главного моста",
  main_bridge_model: "Модель главного моста",
  model: "Модель",
  steerable_bridge_id: "Зав.№ двигателя",
  steerable_bridge_model: "Модель двигателя",
  transmission_id: "Зав.№ трансмиссии",
  transmission_model: "Модель трансмиссии",
  supply_contract_num_date: "Договор поставки №, дата",
  shipment_date: "Дата отгрузки с завода",
  cargo_receiver: "Грузополучатель (конечный потребитель)",
  supply_address: "Адрес поставки (эксплуатации)",
  equipment_add: "Комплектация",
  client: "Клиент",
  service_company: "Сервисная компания",

  refuse_date: "Дата отказа",

  failure_node: "Узел отказа",
  failure_description: "Описание отказа",
  recovery_method: "Способ восстановления",
  spare_parts_use: "Используемые запасные части",
  recovery_date: "Дата восстановления",
  machine_downtime: "Время простоя техники",
  machine_name: "Модель техники",
  machine_id: "Заводской номер машины",

  machine: "Модель техники",
  mt_date: "Дата проведения ТО",
  operating_time: "Наработка, м/час",
  order_date: "Дата заказ-наряда",
  order_num: "№ заказ-наряда",
  type: "Вид ТО",
};

export const sortLabels = {
  machines: [
    {
      value: "model",
      label: "модель",
    },
    {
      value: "engine_model",
      label: "модель двигателя",
    },
    {
      value: "transmission_model",
      label: "модель трансмиссии",
    },
    {
      value: "main_bridge_model",
      label: "модель ведущего моста",
    },
    {
      value: "steerable_bridge_model",
      label: "модель управляемого моста",
    },
    {
      value: "id_num",
      label: "заводской номер",
    },
  ],
  maintenances: [
    {
      value: "mt_date",
      label: "дата проведения ТО",
    },
    {
      value: "service_comapny",
      label: "сервисная компания",
    },
    {
      value: "mt_type",
      label: "вид ТО",
    },
    {
      value: "machine_id",
      label: "заводской номер машины",
    },
  ],
  reclamations: [
    {
      value: "refuse_date",
      label: "дата отказа",
    },
    {
      value: "failure_node",
      label: "узел отказа",
    },
    {
      value: "recovery_method",
      label: "метод восстановления",
    },
    {
      value: "machine_id",
      label: "заводской номер машины",
    },
    {
      value: "service_company",
      label: "сервисная компания",
    },
  ],
};

export const addFormFields = {
  machine: [
    "service_company",

    "id_num",
    "model",
    "engine_model",
    "engine_id",
    "transmission_model",
    "transmission_id",
    "main_bridge_model",
    "main_bridge_id",
    "steerable_bridge_model",
    "steerable_bridge_id",
    "supply_contract_num_date",
    "cargo_receiver",
    "equipment_add",
  ],
  maintenance: [
    "machine",
    "type",
    "mt_date",
    "operating_time",
    "order_num",
    "order_date",
  ],
  reclamation: [
    "machine",
    "refuse_date",
    "operating_time",
    "failure_node",
    "failure_description",
    "recovery_method",
    "spare_parts_use",
    "recovery_date",
    "machine_downtime",
  ],
};

export const textareaFields = ["cargo_receiver", "equipment_add"];

export const choiceFields = [
  "machine_model",
  "engine_model",
  "transmission_model",
  "main_bridge_model",
  "steerable_bridge_model",
  "machine",
  "failure_node",
  "recovery_method",
  "maintenance_type",
];

export const categoryFieldToDetails = (field) => {
  switch (field) {
    case "model":
      return "machine_model";
    case "machine":
      return "machine_model";
    case "type":
      return "maintenance_type";
  }
  return field;
};
