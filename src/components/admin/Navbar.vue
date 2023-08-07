<template>
    <div class="relative flex justify-between w-full h-20 px-6 bg-gray-100 border-b  items-center ">
        <div class="flex">
            <!-- mobile hamburger -->
            <div class="inline-block lg:hidden flex items-center mr-4">
                <button class="hover:text-blue-500 hover:border-white focus:outline-none navbar-burger"
                    @click="toggleSidebar()">
                    <svg class="h-5 w-5" v-bind:style="{ fill: 'black' }" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </button>
            </div>
        </div>

        <div class="relative">
            <img src="https://a7sas.net/wp-content/uploads/2019/07/4060.jpeg" class="w-12 h-12 rounded-full shadow-lg" @click="dropDownOpen = !dropDownOpen">
            <div v-show="dropDownOpen"
                class="z-40 absolute right-0 py-2 mt-2 bg-gray-100 rounded-md shadow-xl w-44">
                <router-link to="/profil" class="block px-4 py-2 text-sm text-gray-800 hover:text-gray-400">Profil
                </router-link>
                <button @click="handleLogout" class="block px-4 py-2 text-sm text-gray-800 hover:text-gray-400">Logout</button>
            </div>
        </div>
    </div>
</template>

<script>
import { auth } from "../../firebase";
import {
    signOut,
} from "firebase/auth";

export default {
    name: 'Navbar',
    computed: {
    },
    data() {
        return {
            dropDownOpen: false
        }
    },
    methods: {
        handleLogout() {
            signOut(auth).then(() => {
                localStorage.setItem('authenticated', false);
                localStorage.removeItem('user');
                this.$router.push({
                    name: 'home'
                });
            }).catch((error) => {
                console.log(error);
            });
        },
    }
}
</script>