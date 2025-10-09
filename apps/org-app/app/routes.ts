import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  ...prefix('app', [
    route("login", "routes/app/auth/login.tsx"),
    route("register", "routes/app/auth/register/index.tsx"),
    route("confirm-account/:accountId", "routes/app/auth/account-confirmation.tsx"),
    layout('routes/layouts/home-layout.tsx', [
      route('home', 'routes/app/main/dashboard.tsx'),
      ...prefix('events', [
          route('/', "routes/app/main/events/index.tsx"),
          route('/new/:eventId?', "routes/app/main/events/create-event/index.tsx")
        ]),
      ...prefix('event/:eventId', [
        layout('routes/layouts/event-layout.tsx', [
          index('routes/app/main/events/profile/overview.tsx'),
          route('fights', 'routes/app/main/events/profile/fights.tsx'),
          route('subscriptions', 'routes/app/main/events/profile/subscriptions.tsx')
        ])
      ])
    ]),
    index('routes/index.tsx')
  ]),
] satisfies RouteConfig;
