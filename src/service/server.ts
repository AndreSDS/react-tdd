import { createServer, Model } from "miragejs";

export function createMockServer() {
  return createServer({
    models: {
      transaction: Model,
    },

    seeds(server) {
      server.db.loadData({
        transactions: [
          {
            id: 1,
            title: "Desenvolvimento de web site",
            type: "deposit",
            category: "Desenvolvimento",
            amount: 12000,
            createdAt: new Date("2021-07-14 09:00:00"),
          },
          {
            id: 2,
            title: "Aluguel",
            type: "withdraw",
            category: "Casa",
            amount: 1000,
            createdAt: new Date("2021-07-20 09:00:00"),
          },
        ],
      });
    },

    routes() {
      this.namespace = "api";

      this.get("/transactions", () => {
        return this.schema.all("transaction");
      });

      this.post("/transactions", (schema, request) => {
        let data = JSON.parse(request.requestBody);
        data = { ...data, createdAt: new Date() };
        return schema.create("transaction", data);
      });
    },
  });
}
