import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';

import Home from '@/pages/home';
import Pokedex from '@/pages/pokedex';
import PokemonDetail from '@/pages/pokemon-detail';
import SearchPage from '@/pages/search';
import ComparePage from '@/pages/compare';
import Favorites from '@/pages/favorites';
import Moves from '@/pages/moves';
import MoveDetail from '@/pages/move-detail';
import Abilities from '@/pages/abilities';
import Teams from '@/pages/teams';
import Collections from '@/pages/collections';
import CollectionsShiny from '@/pages/collections/shiny';
import Admin from '@/pages/admin';
import AdminSubmissions from '@/pages/admin/submissions';
import AdminLogs from '@/pages/admin/logs';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Profile from '@/pages/profile';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pokedex" component={Pokedex} />
        <Route path="/pokemon/:id" component={PokemonDetail} />
        <Route path="/search" component={SearchPage} />
        <Route path="/compare" component={ComparePage} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/moves" component={Moves} />
        <Route path="/moves/:id" component={MoveDetail} />
        <Route path="/abilities" component={Abilities} />
        <Route path="/teams" component={Teams} />
        <Route path="/collections" component={Collections} />
        <Route path="/collections/shiny" component={CollectionsShiny} />
        <Route path="/admin" component={Admin} />
        <Route path="/admin/submissions" component={AdminSubmissions} />
        <Route path="/admin/logs" component={AdminLogs} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster theme="dark" position="top-right" />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
