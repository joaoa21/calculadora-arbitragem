let auth0 = null;

const config = {
  domain: "dev-0rk0emc65ywg6yqc.us.auth0.com",
  client_id: "HmOALfMRukVmj94UjwdeLZnahiURvXfL",
  redirect_uri: window.location.origin + "/dashboard.html",
};

const initAuth0 = async () => {
  auth0 = await createAuth0Client(config);
};

const login = async () => {
  await initAuth0();
  await auth0.loginWithRedirect();
};

const logout = () => {
  auth0.logout({
    returnTo: window.location.origin + "/index.html",
  });
};

const checkAuth = async () => {
  await initAuth0();
  const isAuthenticated = await auth0.isAuthenticated();

  if (!isAuthenticated) {
    const query = window.location.search;
    if (query.includes("code=") && query.includes("state=")) {
      await auth0.handleRedirectCallback();
      window.history.replaceState({}, document.title, "/dashboard.html");
    } else {
      window.location.href = "/login.html";
    }
  }
};
