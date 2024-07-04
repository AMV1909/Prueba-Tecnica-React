import axios from "axios";
import { User } from "../types";

interface Response {
    users: User[];
    nextCursor: number;
}

export const getUsers = async (page: number): Promise<Response> => {
    return await axios
        .get(`https://randomuser.me/api?results=10&seed=random&page=${page}`)
        .then((res) => ({
            users: res.data.results,
            nextCursor: page + 1 > 10 ? undefined : page + 1,
        }));
};
