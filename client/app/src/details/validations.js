const addFormFields = {
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
const getValidation = (field) => {
  switch (field) {
    case "id_num":
      return;
  }
};
