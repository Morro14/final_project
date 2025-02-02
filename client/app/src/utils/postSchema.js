import axios from "axios";
import { serverURL } from "../App";

export async function getSchema(path) {
    console.log('getSchema')
    const data = await axios.options(serverURL + "/" + path + "s").then((r) => {
        console.log('getSchema', r)
        return r
    }
    )
    return data;
}