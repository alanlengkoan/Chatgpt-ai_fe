import {
    createRouter,
    createWebHistory
} from 'vue-router'

// begin:: user
import ChatView from '../views/user/Chat.vue'
import ChatCreateView from '../views/user/ChatCreate.vue'
import GroupView from '../views/user/Group.vue'
import GroupCreateView from '../views/user/GroupCreate.vue'
import GroupMemberView from '../views/user/GroupMember.vue'
import BotView from '../views/user/Bot.vue'
import ProfilView from '../views/user/Profil.vue'
import HomeUserView from '../views/user/Home.vue'
import BaseUserLayout from '../layouts/BaseUser.vue'
// end:: user

// begin:: admin
import DashboardAdminView from '../views/admin/Dashboard.vue'
import UserAdminView from '../views/admin/User.vue'
import ChatAdminView from '../views/admin/Chat.vue'
import GroupAdminView from '../views/admin/Group.vue'
import BotAdminView from '../views/admin/Bot.vue'
import BaseAdminLayout from '../layouts/BaseAdmin.vue'
// end:: admin

import HomeView from '../views/Home.vue'
import LoginView from '../views/Login.vue'
import RegisterView from '../views/Register.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterView,
        },

        // begin:: user
        {
            path: '/user',
            name: 'user',
            component: BaseUserLayout,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: 'home',
                    name: 'user-home',
                    component: HomeUserView,
                },
                {
                    path: 'profil',
                    name: 'user-profil',
                    component: ProfilView,
                },
                {
                    path: 'chat/:id',
                    name: 'user-chat',
                    component: ChatView,
                    props: true,
                },
                {
                    path: 'chat/create',
                    name: 'user-chat-create',
                    component: ChatCreateView,
                },
                {
                    path: 'group/:id',
                    name: 'user-group',
                    component: GroupView,
                    props: true,
                },
                {
                    path: 'group/create',
                    name: 'user-group-create',
                    component: GroupCreateView,
                },
                {
                    path: 'group/member/:id',
                    name: 'user-group-member',
                    component: GroupMemberView,
                    props: true,
                },
                {
                    path: 'bot/:id',
                    name: 'user-bot',
                    component: BotView,
                    props: true,
                },
            ]
        },
        // end:: user

        // begin:: admin
        {
            path: '/admin',
            name: 'admin',
            component: BaseAdminLayout,
            meta: {
                requiresAuth: true
            },
            children: [
                {
                    path: 'dashboard',
                    name: 'admin-dashboard',
                    component: DashboardAdminView,
                },
                {
                    path: 'user',
                    name: 'admin-user',
                    component: UserAdminView,
                },
                {
                    path: 'chat',
                    name: 'admin-chat',
                    component: ChatAdminView,
                },
                {
                    path: 'group',
                    name: 'admin-group',
                    component: GroupAdminView,
                },
                {
                    path: 'bot',
                    name: 'admin-bot',
                    component: BotAdminView,
                },
            ]
        },
        // end:: admin
    ]
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = JSON.parse(localStorage.getItem('authenticated'));
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user ? user.role : null;

    if (isAuthenticated) {
        if (userRole === 'admin') {
            let routeAdmin = [
                'home',
                'login',
                'register',
                'admin',
                'user',
                'user-home',
                'user-profil',
                'user-chat',
                'user-chat-create',
                'user-group',
                'user-group-create',
                'user-group-member',
                'user-bot',
            ];

            if (routeAdmin.includes(to.name)) {
                next({
                    name: 'admin-dashboard'
                });
            }
        } else if (userRole === 'user') {
            let routeUser = [
                'home',
                'user',
                'admin',
                'admin-dashboard',
                'admin-user',
                'admin-chat',
                'admin-group',
                'admin-bot',
            ];

            if (routeUser.includes(to.name)) {
                next({
                    name: 'user-home'
                });
            }
        } else {
            next('/');
        }
    }

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        next('/');
        return;
    }

    next();
});

export default router