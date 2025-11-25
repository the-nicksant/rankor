import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
  // External access routes (no auth required, token-based)
  route('e/:eventId/:token', 'routes/external/access/verify.tsx'),
  ...prefix('external/e/:eventId/:token', [
    layout('routes/layouts/external-access-layout.tsx', [
      route('dashboard', 'routes/external/access/dashboard.tsx'),
      route('checkin', 'routes/external/access/checkin.tsx'),
      route('chronogram', 'routes/external/access/chronogram.tsx'),
      route('scoring', 'routes/external/access/scoring.tsx'),
    ])
  ]),

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
        route('execution', 'routes/app/main/events/execution/event-execution.tsx'),
        layout('routes/layouts/event-layout.tsx', [
          index('routes/app/main/events/profile/overview.tsx'),
          route('fights', 'routes/app/main/events/profile/fights.tsx'),
          route('subscriptions', 'routes/app/main/events/profile/subscriptions.tsx'),
          route('team', 'routes/app/main/events/profile/team.tsx')
        ])
      ])
    ]),
    index('routes/index.tsx')
  ]),
] satisfies RouteConfig;
