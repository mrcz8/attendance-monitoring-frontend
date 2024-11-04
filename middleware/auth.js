export default function ({ route, store, redirect }) {
    const currentPath = route.path;

    // If the user is not logged in and tries to access any route other than the homepage, redirect to homepage
    if (!isLoggedIn(store) && currentPath !== '/') {
        return redirect('/');
    }

    // If the user is logged in
    if (isLoggedIn(store)) {
        const userRole = store.state.auth.user.role;

        // Redirect based on user role for root and auth routes
        if (currentPath === '/' || isRouteAuth(route)) {
            if (userRole === 'super_admin') {
                return redirect('/admin');
            }
            if (userRole === 'admin') {
                return redirect('/employees');
            }
        }

        // Handle admin onboarding
        if (isAdmin(store)) {
            const hasLicenseKey = store.state.auth.user.hasLicenseKey;

            // If the admin does not have a license key, force them to complete onboarding
            if (!hasLicenseKey && currentPath !== '/onboarding') {
                return redirect('/onboarding');
            }

            // If the admin has a license key and is trying to access the onboarding page, redirect them to /admin
            if (hasLicenseKey && currentPath === '/onboarding') {
                return redirect('/employees');
            }
        }

        // Protect admin routes for admin role
        if (isAdmin(store) && isAdminRoute(route)) {
            return; // Allow access to admin routes
        }

        // Protect super_admin routes for super_admin role
        if (isSuperAdmin(store) && isSuperAdminRoute(route)) {
            return; // Allow access to super_admin routes
        }

        // If the user is an admin trying to access super_admin routes, redirect to employees
        if (isAdmin(store) && isSuperAdminRoute(route)) {
            return redirect('/employees'); // Redirect admin to employee route
        }

        // If the user is a super_admin trying to access admin routes, redirect to admin
        if (isSuperAdmin(store) && isAdminRoute(route)) {
            return redirect('/admin'); // Redirect super_admin to admin route
        }
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

/**
 * Helper function to check if the user is a super_admin
 *
 * @param {*} store
 * @returns
 */
function isSuperAdmin(store) {
    return store.state.auth.user && store.state.auth.user.role === 'super_admin';
}

/**
 * Helper function to check if the user is an admin
 *
 * @param {*} store
 * @returns
 */
function isAdmin(store) {
    return store.state.auth.user && store.state.auth.user.role === 'admin';
}

/**
 * Function to check if the route is for authentication pages
 *
 * @param {*} route
 * @returns
 */
function isRouteAuth(route) {
    const authRoutePattern = /^(\/signup|\/reset-password|\/forgot-password)$/;
    return authRoutePattern.test(route.path);
}

/**
 * Function to check if the route is for admin routes
 *
 * @param {*} route
 * @returns
 */
function isAdminRoute(route) {
    const adminRoutesPattern = /^(\/employees|\/departments|\/schedule)$/;
    return adminRoutesPattern.test(route.path);
}

/**
 * Function to check if the route is for super_admin routes
 *
 * @param {*} route
 * @returns
 */
function isSuperAdminRoute(route) {
    const superAdminRoutesPattern = /^\/admin/; // Matches any route starting with /admin
    return superAdminRoutesPattern.test(route.path);
}

/**
 * Function to check if the route is for clients
 *
 * @param {*} route
 * @returns
 */
function isRouteClients(route) {
    return route.path.includes('/clients') || route.path.includes('/license-key');
}
