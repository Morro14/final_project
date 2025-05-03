export const nameDict = {
  // labels
  reclamation: "reclamation",
  machine: "machine",
  maintenance: "maintenance",
  reference: "reference",

  engine_id: "engineID",
  id_num: "machineID",
  main_bridge_id: "mainBridgeID",
  main_bridge_model: "mainBridgeModel",
  steerable_bridge_id: "steerableBridgeID",
  steerable_bridge_model: "steerableBridgeModel",
  transmission_id: "transmissionID",
  transmission_model: "transmissionModel",
  supply_contract_num_date: "contractIDDate",
  shipment_date: "shipmentDate",
  cargo_receiver: "cargoReciever",
  supply_address: "supplyAdress",
  equipment_add: "machineConfiguration",
  client: "client",
  service_company: "serviceCompany",
  refuse_date: "refuseDate",
  failure_description: "failureDesc",
  failure_node: 'failureNode',
  recovery_method: "recoveryMethod",
  spare_parts_use: "spareParts",
  recovery_date: "recoveryDate",
  machine_downtime: "machineDowntime",
  machine_name: "machineModel",
  machine_id: "machineID",
  machine: "machine",
  mt_date: "mtDate",
  operating_time: "operatingTime",
  order_date: "orderDate",
  order_num: "mtID",
  type: "mtType",
  mt_company: "mtCompany",
  model: "machineModel",
  machine_model: "machineModel",
  engine_model: "engineModel",
  not_specified: "notSpecified",
  maintenance_type: "mtType",
  name: "name",
  ref_type: "category",
  description: "description",
  edit: "edit",
  id: "id",
};
// export const nameDictB = {
//   // labels
//   reclamation: "рекламация",
//   machine: "машина",
//   maintenance: "Т.О.",
//   reference: "справочник",

//   engine_id: "Зав.№ двигателя",
//   id_num: "Заводской номер машины",
//   main_bridge_id: "Зав.№ главного моста",
//   main_bridge_model: "Модель главного моста",
//   steerable_bridge_id: "Зав.№ управляемого моста",
//   steerable_bridge_model: "Модель управляемого моста",
//   transmission_id: "Зав.№ трансмиссии",
//   transmission_model: "Модель трансмиссии",
//   supply_contract_num_date: "Договор поставки №, дата",
//   shipment_date: "Дата отгрузки с завода",
//   cargo_receiver: "Грузополучатель (конечный потребитель)",
//   supply_address: "Адрес поставки (эксплуатации)",
//   equipment_add: "Комплектация",
//   client: "Клиент",
//   service_company: "Сервисная компания",
//   refuse_date: "Дата и время отказа",
//   failure_node: "Узел отказа",
//   failure_description: "Описание отказа",
//   recovery_method: "Способ восстановления",
//   spare_parts_use: "Используемые запасные части",
//   recovery_date: "Дата и время восстановления",
//   machine_downtime: "Время простоя техники",
//   machine_name: "Модель техники",
//   machine_id: "Заводской номер машины",
//   machine: "Заводской номер машины",
//   mt_date: "Дата проведения ТО",
//   operating_time: "Наработка, м/час",
//   order_date: "Дата заказ-наряда",
//   order_num: "№ заказ-наряда",
//   type: "Вид ТО",
//   mt_company: "Компания Т.О.",

//   model: "Модель техники",
//   machine_model: "Модель техники",
//   engine_model: "Модель двигателя",
//   not_specified: "не указано",
//   maintenance_type: "Тип Т.О.",
//   name: "Название",
//   ref_type: "Категория",
//   description: "Описание",
//   edit: "ред.",
//   id: "id",
// };
export const filterFields = {
  // fields for filters
  machines: [
    "model",
    "engine_model",
    "transmission_model",
    "main_bridge_model",
    "steerable_bridge_model",
  ],
  maintenances: ["mt_company", "service_company", "type", "machine"],
  reclamations: [
    "failure_node",
    "recovery_method",
    "service_company",
    "machine",
  ],
  references: ["ref_type", "name"],
};


export const textareaFields = [
  "cargo_receiver",
  "equipment_add",
  "failure_description",
];

export const choiceFields = {
  machine: [
    "machine_model",
    "engine_model",
    "transmission_model",
    "main_bridge_model",
    "steerable_bridge_model",
    "service_company",
    "service",
    "client",
  ],

  reclamation: [
    "service_company",
    "recovery_method",
    "failure_node",
    "machine",
  ],

  maintenance: ["maintenance_type", "service_company", "machine"],
};

export const dateFields = ["mt_date", "order_date"];

export const datetimeFields = ["refuse_date", "recovery_date", "shipment_date"];

export const categoryFieldToRef = (field) => {
  switch (field) {
    case "model":
      return "machine_model";
    case "type":
      return "maintenance_type";
    case "mt_company":
      return "service_company";
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
  "edit",
];
