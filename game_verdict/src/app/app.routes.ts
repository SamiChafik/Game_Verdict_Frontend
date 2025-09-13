import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
import { BannedComponent } from './components/banned/banned.component';
import { BanGuard } from './guard/ban.guard';
import { GameListComponent } from './components/game-list/game-list.component';
import { FavoriteGamesComponent } from './components/favorite-games/favorite-games.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [BanGuard]},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate:[AuthGuard, AdminGuard, BanGuard]},
  { path: 'banned', component: BannedComponent },
  { path: 'games', component: GameListComponent, canActivate: [BanGuard]},
  { path: 'favorites', component: FavoriteGamesComponent, canActivate: [AuthGuard, BanGuard]},
];
