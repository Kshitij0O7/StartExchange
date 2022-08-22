const routes = require('next-routes')();

routes
    .add('/startups/new', '/startups/new')
    .add('/startups/:address', '/startups/show')
    .add('/startups/:address/requests', '/startups/requests/index')
    .add('/startups/:address/requests/new', '/startups/requests/new');

module.exports = routes;