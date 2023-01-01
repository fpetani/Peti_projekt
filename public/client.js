const publicVapidKey = 'BEq-5jXDM1fUR6COxrFw3qeQyASJCH9mh10BM2eK4_MKwQov62T9_ycQMsqmnamLGEkFicTBAWOPZuW0OBLYT6o'

// Check for service worker
if ("serviceWorker" in navigator) {
  send().catch(err => console.error(err));
}

// Register SW, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("./push.js");
  console.log("Service Worker Registered...");

  // Register Push
  console.log("Registering Push...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log("Push Registered...");

  // Send Push Notification
  console.log("Sending Push...");
  await fetch("/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json"
    }
  });
  console.log("Push Sent...");
}

let btnNotif = document.getElementById("btnEnableNotifications");

if ("Notification" in window && "serviceWorker" in navigator) {
    btnNotif.addEventListener("click", function () {
        Notification.requestPermission(async function (res) {
            console.log("Request permission result:", res);
            if (res === "granted") {
                await setupPushSubscription();
            } else {
                console.log("User denied push notifs:", res);
            }
        });
    });
} else {
    btnNotif.setAttribute("disabled", "");
    btnNotif.classList.add("btn-outline-danger");
}


function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

