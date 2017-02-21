var log = console.log.bind(console);
var err = console.error.bind(console);

self.addEventListener('install', (e) => {
  log('Service Worker: Installed');
});

self.addEventListener('activate', (e) => {
  log('Push Service Worker: Active');
});

self.addEventListener('push', function(event) {
  log('Push Service Worker: Received push event');

  var data = {};
  if (event.data) {
    data = event.data.json();
  }
  var title = data.topic || "Something Has Happened";
  var message = data.message || "Here's something you might want to check out.";
  var icon = "/assets/push-icon.png";

  self.registration.showNotification(title, {
    body: message,
    tag: 'simple-push-demo-notification',
    icon: icon
  });

});

self.addEventListener("notificationclick", function(event) {
  event.waitUntil(
    clients.openWindow("http://localhost:3000/")
  );
});
