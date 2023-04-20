import { UserType } from "./UserType";

export const UserServices = {

    getUsers() {
        return fetch(' http://localhost:3000/api/users', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    getRoles() {
        return fetch(' http://localhost:3000/api/roles', { headers: { 'Cache-Control': 'no-cache' } })
            .then((res) => res.json());
    },
    createUser(user: UserType) {
        return fetch(' http://localhost:3000/api/users',
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'POST',
                body: JSON.stringify({
                    fullname: user.fullname,
                    email: user.email,
                    password: user.password,
                    roleId: user.role.id,
                }),

            }

        )
            .then((res) => res.json());
    },
    updateUser(user: UserType) {
        return fetch(`http://localhost:3000/api/users/${user.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'PUT',
                body: JSON.stringify({
                    fullname: user.fullname,
                    email: user.email,
                    password: user.password,
                    roleId: user.role.id,
                }),


            }

        )
            .then((res) => res.json());
    },
    deleteUser(user: UserType) {
        return fetch(`http://localhost:3000/api/users/${user.id}`,
            {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Content-Type': 'application/json'

                },
                method: 'DELETE',
            }

        )
            .then((res) => res.json());
    },
}