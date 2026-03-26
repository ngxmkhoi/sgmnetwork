const ICON_URL = "https://ik.imagekit.io/veltrixmediagroup/vfuture/20262203/f20262203?updatedAt=1774193443308";

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? "VFuture", {
      body: data.body ?? "",
      icon: data.icon ?? ICON_URL,
      badge: ICON_URL,
      data: { url: data.url ?? "/" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url ?? "/")
  );
});
