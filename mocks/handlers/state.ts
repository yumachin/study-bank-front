import { http, HttpResponse } from "msw"

export const userHandlers = [
  http.get("http://localhost:8080/api/users/me/state", () => {
    return HttpResponse.json({
      id: 1,
      name: "Mock User",
      balance: 2500,
    })
  }),
]
