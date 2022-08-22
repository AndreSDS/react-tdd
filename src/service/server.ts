import { createServer, Model, Response } from "miragejs";
import { IUser } from "../interfaces/user";

export function createMockServer() {
  return createServer({
    models: {
      user: Model,
    },

    seeds(server) {
      server.db.loadData({
        users: [
          {
            id: 1,
            username: "andré",
            email: "rammpk@email.com",
            password: "123456",
          },
          {
            id: 2,
            username: "bárbara",
            email: "babi@email.com",
            password: "123456",
          },
        ],
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/users", () => {
        const data = this.schema.all("user");
        return data;
      });

      this.get("/users/:username", (schema, request) => {
        const data = schema.db.users.filter(
          (user: IUser) => user.username === request.params.username
        )[0];
        return data;
      });

      this.post("/users", (schema, request) => {
        let data = JSON.parse(request.requestBody);
        const { username, email, password } = data;

        if (username && email && password) {
          return schema.db.users.insert(data);
        } else {
          return new Response(
            400,
            {},
            {
              errors: {
                username: "Username is required",
                email: "Email is required",
                password: "Password is required",
              },
            }
          );
        }
      });
    },
  });
}
