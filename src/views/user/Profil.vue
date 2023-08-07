<!-- untuk halaman profil -->
<template>
    <div class="flex flex-col flex-grow items-center justify-center">
        <h1 class="text-4xl font-bold text-gray-800 px-4 pb-5">Profil</h1>
        <img class="object-cover w-50 h-50 rounded-full" :src="photoURL" :alt="nama" />
        <p class="text-gray-500">{{ nama }}</p>
        <p class="text-gray-500">{{ email }}</p>
        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5" @click="handleLogout">Logout</button>
    </div>
</template>

<script>
import { auth } from "../../firebase";
import {
    signOut,
} from "firebase/auth";

export default {
    name: 'Profil',
    data() {
        return {
            uid: '',
            nama: '',
            email: '',
            photoURL: '',
        }
    },
    methods: {
        loadUser() {
            let user = JSON.parse(localStorage.getItem('user'));

            this.uid = user.uid;
            this.nama = user.name;
            this.email = user.email;
            this.photoURL = user.photo;
        },
        handleLogout() {
            signOut(auth).then(() => {
                localStorage.setItem('authenticated', false);
                this.$router.push({ name: 'welcome' });
            }).catch((error) => {
                console.log(error);
            });
        },
    },
    mounted() {
        this.loadUser();
    }
}
</script>