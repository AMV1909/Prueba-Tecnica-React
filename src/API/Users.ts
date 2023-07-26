import axios from "axios";

export const getUsers = async () => {
    return await axios
        .get("https://randomuser.me/api?results=100")
        .then((res) => res.data.results)
        .catch((err) => console.error(err));
};
