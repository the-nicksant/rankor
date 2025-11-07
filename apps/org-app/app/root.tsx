import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  redirect,
  Scripts,
  ScrollRestoration,
  useNavigate,
  useRouteError,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from 'nuqs/adapters/react-router/v7'

import customParseFormat from 'dayjs/plugin/customParseFormat';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import dayjs from "dayjs";
import { Toaster } from "@repo/ui/sonner";
import { TriangleAlert } from "lucide-react";
import type { CustomAxiosError } from "./lib/http/types";
import { Button } from "@repo/ui/button";

import 'dayjs/locale/pt-br'
import { AppModals } from "./components/shared/app-modals";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat)
dayjs.locale('pt-br')

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=Special+Gothic+Expanded+One&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <Meta />
        <Links />
      </head>
      <body className="dark dark:text-white">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const queryClient = new QueryClient()

export default function App() {
  return (
    <NuqsAdapter>
      <QueryClientProvider client={queryClient}>
        <Outlet />
        <Toaster />
        <AppModals />
      </QueryClientProvider>
    </NuqsAdapter>
  )
}

function isCustomApiError(error: unknown): error is CustomAxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

interface ParsedError {
  title: string;
  message: string;
  stack?: string;
}

function parseError(error: unknown): ParsedError {
  if (isCustomApiError(error)) {
    const title = `Erro ${error.statusCode || 'de Rede'}`;
    const message = error.message || 'Ocorreu um problema na comunicação com o servidor.';
    const stack = import.meta.env.DEV ? JSON.stringify(error.originalError, null, 2) : undefined;
    return { title, message, stack };
  }
  
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return {
        title: 'Página Não Encontrada (404)',
        message: 'O endereço que você tentou acessar não existe ou foi movido.',
      };
    }
     return {
        title: `Erro ${error.status}`,
        message: error.statusText || 'Ocorreu um erro inesperado na rota.',
        stack: import.meta.env.DEV ? error.data : undefined
      };
  }

  if (import.meta.env.DEV && error instanceof Error) {
    return {
      title: 'Erro Inesperado na Aplicação',
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    title: 'Oops! Algo deu errado',
    message: 'Um erro inesperado ocorreu. Nossa equipe já foi notificada.',
  };
}


export function ErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();
  const parsedError = parseError(error);

  const handleRetry = () => {
    navigate(0);
  };

  const handleGoHome = () => {
    navigate('/app/home');
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <div className="flex w-full max-w-lg flex-col items-center  bg-white dark:bg-slate-800 p-8 shadow-2xl text-center">
        <TriangleAlert className="h-16 w-16 text-red-500" />
        
        <h1 className="mt-6 text-3xl font-bold text-slate-800 dark:text-slate-100">
          {parsedError.title}
        </h1>
        
        <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
          {parsedError.message}
        </p>

        <div className="mt-8 flex gap-4">
          <Button onClick={handleRetry} variant={'secondary'}>
            Tentar Novamente
          </Button>
          <Button onClick={handleGoHome}>
           
            Voltar para o Início
          </Button>
        </div>

        {parsedError.stack && (
          <details className="w-full mt-8 text-left">
            <summary className="cursor-pointer text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
              Detalhes técnicos (DEV)
            </summary>
            <pre className="mt-2 w-full whitespace-pre-wrap break-words rounded-md bg-slate-100 dark:bg-slate-900 p-4 text-xs text-slate-700 dark:text-slate-300 overflow-auto">
              <code>{parsedError.stack}</code>
            </pre>
          </details>
        )}
      </div>
    </main>
  );
}
