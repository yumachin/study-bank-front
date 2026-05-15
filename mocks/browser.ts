import { setupWorker } from "msw/browser"
import { handlers } from "./handlers"

// workerを起動
export const worker = setupWorker(...handlers)
