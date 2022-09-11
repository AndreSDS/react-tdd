import { createServer, Model, Response, Factory } from "miragejs";
import { IUser } from "../interfaces/user";
import { getPage } from "./usersMock";

export function createMockServer() {
  return createServer({
    models: {
      user: Model.extend({} as IUser),
    },

    factories: {
      user: Factory.extend({
        id(i) {
          return `user-${i}`;
        },
        username(i) {
          return `user-${i}`;
        },
        email(i) {
          return `user-${i}`;
        },
        password(i) {
          return `user-${i}`;
        },
      }),
    },

    seeds(server) {
      server.createList("user", 7);
    },

    routes() {
      this.namespace = "api";

      this.get("/users", (schema, request) => {
        const { page, size } = request.queryParams;

        const data = this.schema.all("user");
        const userPagenation = getPage(Number(page), Number(size), data.models);
        const dataUsers = userPagenation.content.map((item) => ({
          ...item.attrs,
          password: undefined,
        }));
        return { data: dataUsers };
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

        if (username && email && password && password.length > 5) {
          data = { ...data, id: schema.db.users.length + 1 };
          return schema.create("user", data);
        } else {
          return new Response(
            400,
            {},
            {
              errors: {
                username: "Username is required",
                email: "E-mail cannot be null",
                password: "Password must be at least 6 characters",
              },
            }
          );
        }
      });

      this.post("/users/token/:token", (schema, request) => {
        const { token } = request.params;
        if (token) {
          return new Response(200);
        } else {
          return new Response(
            400,
            {},
            {
              errors: { message: "Activation failed" },
            }
          );
        }
      });
    },
  });
}
