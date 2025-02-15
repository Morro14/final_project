import { nameDict } from "./names";

export const getChoices = (category, data, schema) => {
  let options = {};
  if (category === "reference") {
    options = { ref_type: [] };
    schema.ref_type.choices.forEach((r, i) => {
      options.ref_type.push({
        type: r.value,
        name: nameDict[r.value],
        id: i,
        slug: r.value,
      });
    });
    return options;
  }

  let refCategories = data.ref.map((ref) => ref.ref_type);
  let refCategoriesSet = new Set(refCategories);
  refCategories = [...refCategoriesSet];

  refCategories.forEach((refCat) => {
    Object.assign(options, { [refCat]: [] });
  });

  data.ref.forEach((ref) => {
    options[ref.ref_type].push(ref);
  });

  if (category !== "machine") {
    options["machines"] = data.machines;
    const machinesFormatted = options["machines"].map((e, i) => ({
      id: i,
      name: e.id_num,
    }));
    options["machines"] = machinesFormatted;
  } else if (category === "machines") {
    options["model"] = options["machine_model"];
    delete options["machine_model"];
  }
  return options;
};
