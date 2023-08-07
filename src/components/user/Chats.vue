<script setup>
import Loading from "./../Loading.vue";
</script>

<template>
    <div :class="loading ? 'hidden' : 'flex items-center justify-center h-screen'">
        <Loading />
    </div>
    <div class="px-4 flex flex-col flex-grow h-0 overflow-auto">
        <div v-if="chats.length !== 0">
            <ul class="space-y-4">
                <li :class="row.seen ? 'bg-white rounded-lg shadow-md p-4' : 'bg-blue-100 rounded-lg shadow-md p-4'"
                    v-for="row in chats" :key="row.id" @click="openChat(row.id)">
                    <div class="flex items-center mb-2">
                        <img class="h-10 w-10 rounded-full object-cover mr-2" :src="row.photo" :alt="row.name">
                        <div>
                            <h2 class="font-bold text-lg">{{ row.name }}</h2>
                            <p class="text-gray-500">{{ row.email }}</p>
                        </div>
                    </div>
                    <p class="text-gray-600">
                        {{ row.latest_message }}
                    </p>
                </li>
            </ul>
        </div>
        <div v-else class="flex items-center justify-center h-screen">
            <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">
                <span class="font-medium">No</span> Chats.
            </div>
        </div>
    </div>
    <div class="relative">
        <router-link to="/user/chat/create" class="absolute bottom-2 right-4 bg-gray-600 w-10 h-10 rounded-full drop-shadow-lg flex justify-center items-center text-white text-xl hover:bg-gray-700 hover:drop-shadow-2xl">
            <font-awesome-icon icon="fa-solid fa-plus" />
        </router-link>
    </div>
</template>

<script>
import { db } from "../../firebase";
import {
    collection,
    query,
    where,
    getDocs,
    onSnapshot,
    orderBy,
    or
} from "firebase/firestore";
import { onUnmounted, ref } from 'vue';

export default {
    name: 'Chats',
    props: {
        uid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            chats: ref([]),
            users: []
        }
    },
    methods: {
        openChat(id) {
            this.$router.push({ name: 'user-chat', params: { id: id } });
        },
        async loadChat () {
            try {
                // untuk ambil data users
                const tblUsers = query(collection(db, 'Users'));
                const getUsers = await getDocs(tblUsers);
                this.users = getUsers.docs.map((docUsers) => ({
                    id: docUsers.id,
                    ...docUsers.data()
                }));

                // untuk ambil data friends
                const tblFriends = collection(db, "Friends");
                const qryFriends = query(tblFriends, or(
                    where("id_sender", "==", this.uid),
                    where("id_receiver", "==", this.uid)
                ), orderBy('latest_message_time', 'desc'));

                const unsubscribe = onSnapshot(qryFriends, (snapshotFrineds) => {                   
                    this.chats = [];
                    snapshotFrineds.docs.map((docFriends) => {
                        if (docFriends.data().latest_message !== '') {
                            let user = null;

                            if (docFriends.data().id_sender == this.uid) {
                                user = this.users.find((row) => row.uid == docFriends.data().id_receiver);
                            } else {
                                user = this.users.find((row) => row.uid == docFriends.data().id_sender);
                            }

                            this.chats.push({
                                id: docFriends.id,
                                seen: docFriends.data().seen,
                                latest_message: docFriends.data().latest_message,
                                name: user.name,
                                email: user.email,
                                photo: user.photo,
                            });
                        };
                    });
                });

                this.loading = true;

                onUnmounted(unsubscribe);
            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {
        this.loadChat();
    }
}
</script>