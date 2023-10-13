function Shared() {
  const shared = {};
  const divMsg = document.querySelector("div#msg");

  let currentUser = null;

  function showMessage(msg) {
    divMsg.querySelector("#msgContent").innerHTML = msg;
    divMsg.style.display = "block";
  }

  function redirect(page) {
    window.location.replace(page + ".html");
  }

  shared.getCurrentUser = async function () {
    let res;
    try {
      res = await fetch("./getCurrentUser");
      const resUser = await res.json();
      if (resUser.isLoggedIn) {
        currentUser = resUser.user;
        renderUsername(currentUser.user);
      } else {
        currentUser = null;
        redirect("login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  function renderUsername(username) {
    console.log("renderUsername");
    const usernameEl = document.getElementById("navUsername");
    usernameEl.innerHTML = "Welcome, " + username + "!";
  }

  shared.setupLogout = function () {
    const linkLogout = document.querySelector("#linkLogout");
    let res;
    linkLogout.addEventListener("click", async (event) => {
      event.preventDefault();
      console.log("loggout");
      res = await fetch("/logout");
      const resLogout = await res.json();
      showMessage(resLogout.msg);
      setTimeout(() => redirect("/login"), 1000);
    });
  };

  shared.setupSave = function () {
    const form = document.querySelector("form#newnote");
    const linkLogout = document.getElementById("save");
    let res;
    linkLogout.addEventListener("click", async (event) => {
      event.preventDefault();
      res = await fetch("./createNote", {
        method: "POST",
        body: new URLSearchParams(new FormData(form)),
      });
      const response = await res.json();
      showMessage(response.msg);
      setTimeout(() => redirect("/index"), 1000);
    });
  };
  return shared;
}

document.addEventListener("DOMContentLoaded", async () => {
  const shared = Shared();
      
  shared.getCurrentUser();
  shared.setupLogout();
  

})
