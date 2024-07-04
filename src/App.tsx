import { useMemo, useState } from "react";

import { useUsers } from "./hooks/useUsers";
import { UsersList } from "./Components/UsersList";
import { Results } from "./Components/Results";
import { SortBy, User } from "./types.d";

import "./App.css";

export function App() {
    const [showColors, setShowColors] = useState(false);
    const [sorting, setSorting] = useState<SortBy>(SortBy.NONE);
    const [filterCountry, setFilterCountry] = useState<string | null>(null);

    const { isLoading, isError, users, refetch, fetchNextPage, hasNextPage } =
        useUsers();

    // const originalUsers = useRef<User[]>([]);

    const toggleColors = () => setShowColors(!showColors);
    const toggleSortByCountry = () =>
        setSorting(sorting === SortBy.NONE ? SortBy.COUNTRY : SortBy.NONE);

    const handleReset = async () => {
        await refetch();
    };

    const handleDelete = (email: string) => {
        // setUsers(users.filter((user) => user.email !== email));
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
                <Results />

                {users.length > 0 && (
                    <UsersList
                        changeSorting={handleChangeSort}
                        deleteUser={handleDelete}
                        showColors={showColors}
                        users={sortedUsers}
                    />
                )}

                {isLoading && <strong>Cargando ...</strong>}
                {isError && <p>Ha habido un error</p>}
                {!isLoading && !isError && users.length === 0 && (
                    <p>No hay usuarios</p>
                )}

                {hasNextPage && (
                    <button onClick={() => fetchNextPage()}>
                        Cargar más resultados
                    </button>
                )}
            </main>
        </div>
    );
}
