<template>
    <div class="bg-blue-100 h-screen overflow-hidden flex items-center justify-center">
        <div class="bg-white lg:w-6/12 md:7/12 w-8/12 shadow-3xl">
            <div class="bg-gray-800 absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full p-4 md:p-8">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#FFF">
                    <path d="M0 3v18h24v-18h-24zm6.623 7.929l-4.623 5.712v-9.458l4.623 3.746zm-4.141-5.929h19.035l-9.517 7.713-9.518-7.713zm5.694 7.188l3.824 3.099 3.83-3.104 5.612 6.817h-18.779l5.513-6.812zm9.208-1.264l4.616-3.741v9.348l-4.616-5.607z" />
                </svg>
            </div>
            <div class="p-12 md:p-24">
                <div class="flex items-center text-lg mb-6 md:mb-8">
                    <font-awesome-icon class="absolute ml-3" icon="fa-solid fa-envelope" />
                    <input type="text" id="email" ref="email" :placeholder="email" class="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full" />
                </div>
                <div class="flex items-center text-lg mb-6 md:mb-8">
                    <font-awesome-icon class="absolute ml-3" icon="fa-solid fa-lock" />
                    <input type="password" id="password" ref="password" :placeholder="password" class="bg-gray-200 pl-12 py-2 md:py-4 focus:outline-none w-full" />
                </div>
                <button type="button" class="inline-block w-full rounded bg-blue-800 px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white hover:bg-blue-400" @click="register" @keypress.enter="register">Register</button>
            </div>
        </div>
    </div>
</template>

<script>
import { auth } from "../firebase";
import {
    createUserWithEmailAndPassword
} from "firebase/auth";

export default {
    name: 'Register',
    data() {
        return {
            email: 'Masukkan Email',
            password: 'Masukkan Password',
        }
    },
    methods: {
        register() {
            createUserWithEmailAndPassword(auth, this.$refs.email.value, this.$refs.password.value).then((userCredential) => {
                this.$router.push({
                    name: 'login'
                });
            }).catch((error) => {
                const errorCode = error.code;
                switch (errorCode) {
                    case 'auth/email-already-in-use':
                        alert('Email sudah digunakan');
                        break;
                    case 'auth/invalid-email':
                        alert('Email tidak valid');
                        break;
                    case 'auth/weak-password':
                        alert('Password lemah');
                        break;
                    default:
                        alert('Terjadi kesalahan');
                        break;
                }
            });
        },
    },
    mounted() {
    }
}
</script>