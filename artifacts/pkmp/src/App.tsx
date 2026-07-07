import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { Toaster } from 'sonner';

import { AuthProvider } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';

import Home from '@/pages/home';
import Pokedex from '@/pages/pokedex';
import PokemonDetail from '@/pages/pokemon-detail';
import SearchPage from '@/pages/search';
import ComparePage from '@/pages/compare';
import Favorites from '@/pages/favorites';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Profile from '@/pages/profile';
import Admin from '@/pages/admin';
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
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/profile" component={Profile} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster theme="dark" position="top-right" />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
