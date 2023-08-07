<!-- untuk tampilan daftar pesan -->
<script setup>
import Navbar from '../../components/user/Navbar.vue';
import Chats from '../../components/user/Chats.vue';
import Groups from '../../components/user/Groups.vue';
import Bots from '../../components/user/Bots.vue';
</script>

<template>
    <!-- begin:: navbar -->
    <Navbar :uid="uid" :nama="nama" :photoURL="photoURL" :email="email" />
    <!-- end:: navbar -->

    <!-- begin:: chat template -->
    <ul class="px-4 flex mb-0 list-none flex-wrap py-4 flex-row">
        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <a class="text-xs font-bold px-5 py-3 shadow-lg rounded block hover:cursor-pointer"
                v-on:click="toggleTabs(1)"
                v-bind:class="{ 'text-black bg-white': open_tab !== 1, 'bg-gray-100': open_tab === 1 }">
                Chat
            </a>
        </li>
        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <a class="text-xs font-bold px-5 py-3 shadow-lg rounded block hover:cursor-pointer"
                v-on:click="toggleTabs(2)"
                v-bind:class="{ 'text-black bg-white': open_tab !== 2, 'bg-gray-100': open_tab === 2 }">
                Group
            </a>
        </li>
        <li class="-mb-px mr-2 last:mr-0 flex-auto text-center">
            <a class="text-xs font-bold px-5 py-3 shadow-lg rounded block hover:cursor-pointer"
                v-on:click="toggleTabs(3)"
                v-bind:class="{ 'text-black bg-white': open_tab !== 3, 'bg-gray-100': open_tab === 3 }">
                Bot
            </a>
        </li>
    </ul>
    <!-- begin:: chat -->
    <div v-bind:class="{ 'hidden': open_tab !== 1, 'block flex flex-col flex-grow': open_tab === 1 }">
        <Chats :uid="uid" />
    </div>
    <!-- end:: chat -->
    <!-- begin:: group -->
    <div v-bind:class="{ 'hidden': open_tab !== 2, 'block flex flex-col flex-grow': open_tab === 2 }">
        <Groups :uid="uid" />
    </div>
    <!-- end:: group -->
    <!-- begin:: bot -->
    <div v-bind:class="{ 'hidden': open_tab !== 3, 'block flex flex-col flex-grow': open_tab === 3 }">
        <Bots :uid="uid" />
    </div>
    <!-- end:: bot -->
    <!-- end:: chat template -->
</template>


<script>
export default {
    name: 'Home',
    data() {
        return {
            open_tab: 1,
            uid: '',
            nama: '',
            email: '',
            photoURL: '',
        }
    },
    methods: {
        toggleTabs(tabNumber) {
            this.open_tab = tabNumber
        },
        loadUser() {
            let user = JSON.parse(localStorage.getItem('user'));

            this.uid = user.uid;
            this.nama = user.name;
            this.email = user.email;
            this.photoURL = user.photo;
        },
    },
    mounted() {
        this.loadUser();
    }
}
</script>