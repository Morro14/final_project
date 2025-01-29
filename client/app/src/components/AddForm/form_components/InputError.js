export const InputError = ({ message }) => {

    return (
        <div className="input-error">
            {message}
        </div>
    )
}

export function findErrors(errors, name) {

    let filtered = Object.keys(errors).filter(key => (key.includes(name))
    )
    const reduced = filtered.reduce((cur, key) => {
        return Object.assign(cur, { error: errors[key]['message'] })
    }, {})
    return reduced
}

export function isFormInvalid(err) {
    if (Object.keys(err).length > 0) {
        return true;
    }
    return false;
}