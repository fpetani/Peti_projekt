self.addEventListener("push", e => {
    const data = e.data.json();
    console.log("Push Recieved...");
    self.registration.showNotification(data.title, {
      body: "Notified by Peti projekt!",
      icon: "images/image.png"
    });
  });