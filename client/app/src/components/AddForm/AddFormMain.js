import { Outlet, useOutletContext } from "react-router-dom";


export default function AddFormMain() {
    const user = useOutletContext();

    return (
        <div className="add-form-main">

            <Outlet context={{ user: user }}></Outlet>

        </div>
    );
}