import { useEffect, useMemo, useRef, useState } from "react";

import { getUsers } from "./API/Users";
import { SortBy, User } from "./types.d";
import { UsersList } from "./Components/UsersList";

import "./App.css";

export function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [showColors, setShowColors] = useState(false);
    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
    const [filterCountry, setFilterCountry] = useState<string | null>(null);

    const originalUsers = useRef<User[]>([]);

    useEffect(() => {
        getUsers().then((data) => {
            setUsers(data);
            originalUsers.current = data;
        });
    }, []);

    const toggleColors = () => setShowColors(!showColors);
    const toggleSortByCountry = () =>
        setSorting(sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE);

    const handleReset = () => {
        setUsers(originalUsers.current);
    };

    const handleDelete = (email: string) => {
        setUsers(users.filter((user) => user.email !== email));
    };

    const handleChangeSort = (sort: SortBy) => {
        setSorting(sort);
    };

    const filteredUsers = useMemo(() => {
        return filterCountry !== null && filterCountry.length > 0
            ? users.filter((user) =>
                  user.location.country
                      .toLowerCase()
                      .includes(filterCountry.toLowerCase())
              )
            : users;
    }, [filterCountry, users]);

    const sortedUsers = useMemo(() => {
        if (sorting === SortBy.NONE) return filteredUsers;

        const compareProperties: Record<string, (user: User) => any> = {
            [SortBy.NAME]: (user) => user.name.first,
            [SortBy.LAST]: (user) => user.name.last,
            [SortBy.COUNTRY]: (user) => user.location.country,
        };

        return filteredUsers.toSorted((a, b) => {
            return compareProperties[sorting](a).localeCompare(
                compareProperties[sorting](b)
            );
        });
    }, [filteredUsers, sorting]);

    return (
        <div className="App">
            <h1>Prueba Técnica</h1>

            <header>
                <button onClick={toggleColors}>
                    {showColors ? "Quitar colorear filas" : "Colorear filas"}
                </button>

                <button onClick={toggleSortByCountry}>
                    {sorting === SortBy.COUNTRY
                        ? "Quitar ordenar por país"
                        : "Ordenar por país"}
                </button>

                <button onClick={handleReset}>Resetear estado</button>

                <input
                    onChange={(e) => setFilterCountry(e.target.value)}
                    type="text"
                    placeholder="Filtrar por país"
                />
            </header>

            <main>
                <UsersList
                    changeSorting={handleChangeSort}
                    deleteUser={handleDelete}
                    showColors={showColors}
                    users={sortedUsers}
                />
            </main>
        </div>
    );
}
