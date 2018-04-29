import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard'

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: './views/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: './views/register/register.module#RegisterModule'
  }, 
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: '홈'
    },
    canActivate: [AuthGuard],
    children: [    
      {
        path: 'account',
        loadChildren: './views/account/account.module#AccountModule'
      },
      {
        path: 'admin',
        loadChildren: './views/admin/admin.module#AdminModule'
      },
      {
        path: 'favorite',
        loadChildren: './views/favorite/favorite.module#FavoriteModule'
      },
      {
        path: 'monitoring',
        loadChildren: './views/monitoring/monitoring.module#MonitoringModule'
      },
      {
        path: 'alarm',
        loadChildren: './views/alarm/alarm.module#AlarmModule'
      },
      {
        path: 'test',
        loadChildren: './views/test/test.module#TestModule'
      },
      {
        path: 'test2',
        loadChildren: './views/test2/test2.module#Test2Module'
      },
      {
        path: 'test3',
        loadChildren: './views/test3/test3.module#Test3Module'
      },
      {
        path: 'test4',
        loadChildren: './views/test4/test4.module#Test4Module'
      },
      {
        path: 'test5',
        loadChildren: './views/test5/test5.module#Test5Module'
      },
      {
        path: 'test6',
        loadChildren: './views/test6/test6.module#Test6Module'
      },
      {
        path: 'test7',
        loadChildren: './views/test7/test7.module#Test7Module'
      },
      {
        path: 'test8',
        loadChildren: './views/test8/test8.module#Test8Module'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
