export default function ({ store, redirect, route }) {
    console.log("Current route:", route.name);
    const userRole = store.state.auth.user.role;
    const adminRoutes = ['employees', 'schedules', 'departments'];

    // If user is logged in and is super_admin, check access to admin routes
    if (isLoggedIn(store) && userRole === 'super_admin' && adminRoutes.includes(route.name)) {
      // Redirect super_admin to homepage if trying to access admin routes
      return redirect('/');
    }
  }

  /**
   * Helper function to check if the user is logged in
   *
   * @param {*} store
   * @returns
   */
  function isLoggedIn(store) {
    return store.state.auth.isLoggedIn;
  }
