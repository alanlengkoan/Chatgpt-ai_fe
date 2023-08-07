<template>
    <div class="relative flex justify-between p-3 border-b border-gray-300">
        <router-link to="/user/home" class="items-center p-2">
            <font-awesome-icon icon="fa-solid fa-arrow-left" />
        </router-link>
        <div class="relative" v-if="this.id !== ''">
            <button @click="show = !show" class="items-center p-2">
                <font-awesome-icon icon="fa-solid fa-bars" />
            </button>
            <div v-show="show" class="z-40 absolute right-0 py-2 mt-2 bg-white rounded-md shadow-xl w-44">
                <button @click="deleteMessage(this.id)" class="block px-4 py-2 text-sm text-gray-800 hover:text-gray-400">Delete Message</button>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from "../../firebase";
import {
    deleteDoc,
    doc
} from "firebase/firestore";

export default {
    name: 'NavbarBot',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        deleteMessage(id) {
            deleteDoc(doc(db, "Bots", id));
            this.$router.push({ name: 'home' });
        }
    },
    mounted() {

    }
}
</script>