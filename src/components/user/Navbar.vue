<template>
    <div class="relative flex justify-between p-3 border-b border-gray-300">
        <router-link to="/user/home" class="flex items-center">
            <img class="object-cover w-10 h-10 rounded-full" :src="photoURL" :alt="nama" />
            <div>
                <h2 class="ml-2 font-bold">{{ nama }}</h2>
                <p class="ml-2 font-bold text-sm text-gray-500">{{ email }}</p>
            </div>
            <span class="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3"></span>
        </router-link>
        <div class="relative">
            <button @click="show = !show" class="items-center p-2">
                <font-awesome-icon icon="fa-solid fa-bars" />
            </button>
            <div v-show="show" class="z-40 absolute right-0 py-2 mt-2 bg-white rounded-md shadow-xl w-44">
                <router-link to="/user/profil" class="block px-4 py-2 text-sm text-gray-800 hover:text-gray-400">Profil</router-link>
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
    props: {
        uid: {
            type: String,
            required: true,
            default: ''
        },
        nama: {
            type: String,
            required: true,
            default: ''
        },
        photoURL: {
            type: String,
            required: true,
            default: ''
        },
        email: {
            type: String,
            required: true,
            default: ''
        },
    },
    data() {
        return {
            show: false,
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
    },
    mounted() {

    }
}
</script>