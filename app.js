
const signupUrl = "https://signup.live.com/";

document.getElementById("startBtn").addEventListener("click", () => {
  window.open(signupUrl, "_blank", "noopener,noreferrer");
  const message = document.getElementById("runnerMessage");
  if (message) {
    message.textContent =
      "Microsoft signup opened. Complete signup on Microsoft's official website.";
  }
});

document.getElementById("stopBtn").addEventListener("click", () => {
  const message = document.getElementById("runnerMessage");
  if (message) {
    message.textContent = "No background task is running.";
  }
});
