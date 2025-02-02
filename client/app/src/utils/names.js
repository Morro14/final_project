export const nameDict = {
  // labels
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
  refuse_date: "Дата и время отказа",
  failure_node: "Узел отказа",
  failure_description: "Описание отказа",
  recovery_method: "Способ восстановления",
  spare_parts_use: "Используемые запасные части",
  recovery_date: "Дата и время восстановления",
  machine_downtime: "Время простоя техники",
  machine_name: "Модель техники",
  machine_id: "Заводской номер машины",
  machine: "Модель техники",
  mt_date: "Дата проведения ТО",
  operating_time: "Наработка, м/час",
  order_date: "Дата заказ-наряда",
  order_num: "№ заказ-наряда",
  type: "Вид ТО",
  mt_company: "Компания Т.О."
};

export const filterFields = {
  // fields for filters
  machines: [
    "model",
    "engine_model",
    "transmission_model",
    "main_bridge_model",
    "steerable_bridge_model",
  ],
  maintenances: [
    "mt_company",
    "service_company",
    "type",
    "machine_id",
  ],
  reclamations: [
    "failure_node",
    "recovery_method",
    "service_company",
  ]

};

export const addFormFields = {
  // form fields 
  // #TODO получать поля для формы через API
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
    "service_company",
    "mt_company",
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


export const textareaFields = ["cargo_receiver", "equipment_add", "failure_description"];

export const choiceFields = {
  machines:
    [
      "machine_model",
      "engine_model",
      "transmission_model",
      "main_bridge_model",
      "steerable_bridge_model",
      "service_company"],
  machine:
    [
      "machine_model",
      "engine_model",
      "transmission_model",
      "main_bridge_model",
      "steerable_bridge_model",
      "service_company",
      "service",
      "client"],
  reclamations:
    [
      "service_company",
      "recovery_method",
      "failure_node"],
  maintenances:
    [
      "maintenance_type",
      "service_company"
    ]


}


export const dateFields = [
  "mt_date",
  "order_date",

]

export const datetimeFields = [
  "refuse_date",
  "recovery_date"
]

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

export const linkNames = [
  "model",
  "engine_model",
  "main_bridge_model",
  "steerable_bridge_model",
  "transmission_model",
  "type",
  "service_company",
  "mt_company",
  "recovery_method",
  "failure_node",
];


