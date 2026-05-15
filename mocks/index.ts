export async function startMSW() {
  if (process.env.NEXT_PUBLIC_API_MOCK !== "true") return

  const { worker } = await import("./browser")
  await worker.start({
    // 登録されていないリクエストは、普通にapi通信する
    onUnhandledRequest: "bypass",
  })
}
