import { createServer, Model, Response, Factory, Request } from "miragejs";
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
          return `user-${i}@email.com`;
        },
        password(i) {
          return `user-0${i}`;
        },
      }),
    },

    seeds(server) {
      server.createList("user", 7);
    },

    routes() {
      this.namespace = "api";

      this.get("/users", (schema, request: Request) => {
        const { page, size }: any = request?.queryParams;

        const data = this.schema.all("user");
        const userPagenation = getPage(Number(page), Number(size), data.models);
        const dataUsers = {
          ...userPagenation,
          content: userPagenation.content.map((item: any) => ({
            ...item.attrs,
            password: undefined,
          })),
        };
        return { data: dataUsers };
      });

      this.get("/users/:id", (schema, request) => {
        const { id } = request.params;
        const data: IUser | null = schema.findBy("user", { id });

        if (!data) {
          return new Response(
            404,
            {},
            {
              message: "User not found",
            }
          );
        }

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

      this.post("/auth", (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        const data: IUser | null = schema.findBy("user", { email, password });

        if (data) {
          return new Response(
            200,
            {},
            {
              id: data.id,
              username: data.username,
              token: `token-${data.id}-${data.username}`,
            }
          );
        } else {
          return new Response(
            401,
            {},
            {
              message: "Incorrect email or password",
            }
          );
        }
      });
    },
  });
}
