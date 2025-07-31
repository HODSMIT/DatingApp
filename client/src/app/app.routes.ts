import { Routes } from '@angular/router';
import { Home } from '../features/home/home';
import { MemberList } from '../features/members/member-list/member-list';
import { MemberDetailed } from '../features/members/member-detailed/member-detailed';
import { Lists } from '../features/lists/lists';
import { Messages } from '../features/messages/messages';
import { authGuard } from '../Core/guards/auth-guard';
import { TestError } from '../features/test-error/test-error';
import { NotFound } from '../Shared/error/not-found/not-found';
import { ServerError } from '../Shared/error/server-error/server-error';

export const routes: Routes = [
    {path: '',component: Home},
    {
        path:'',
        runGuardsAndResolvers:'always',
        canActivate:[authGuard],
        children:[
    {path: 'members',component: MemberList},
    {path: 'members/:id',component: MemberDetailed},
    {path: 'lists',component: Lists},
    {path: 'messages',component: Messages},

        ]
    },
    {path:'error',component:TestError},
    {path:'server-error',component:ServerError},
    {path: '**',component: NotFound},
    
];
