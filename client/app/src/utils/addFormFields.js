

export const getOptions = (category, data, role, field) => {
    let options = {}
    let refCategories = data.ref.map(ref => ref.ref_type)
    let refCategoriesSet = new Set(refCategories)
    refCategories = [...refCategoriesSet]
    refCategories.forEach(refCat => {
        Object.assign(options, { [refCat]: [] })
    });

    data.ref.forEach(ref => {
        options[ref.ref_type].push(ref)
    })
    if (category !== 'machine') {
        options['machines'] = data.machines
    }
    // if (role === 'client_company' && options.client) {
    //     delete options.client
    // }
    // if (role === 'service' && options.service) {
    //     delete options.service
    // }
    console.log('addFormFields', options);
    return options
}