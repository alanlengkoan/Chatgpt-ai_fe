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
                            <p class="text-gray-500">{{ row.info }}</p>
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
                <span class="font-medium">No</span> Bots.
            </div>
        </div>
    </div>
    <div class="relative">
        <button type="button" @click="newChat" class="absolute bottom-2 right-4 bg-gray-600 w-10 h-10 rounded-full drop-shadow-lg flex justify-center items-center text-white text-xl hover:bg-gray-700 hover:drop-shadow-2xl">
            <font-awesome-icon icon="fa-solid fa-plus" />
        </button>
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
    serverTimestamp,
    addDoc
} from "firebase/firestore";
import { onUnmounted, ref } from 'vue';

export default {
    name: 'Bots',
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
            this.$router.push({ name: 'user-bot', params: { id: id } });
        },
        async newChat() {
            const tblBots = collection(db, 'Bots');
            const qryBots = query(tblBots, where('uid', '==', this.uid));
            const getBots = await getDocs(qryBots);

            if (getBots.empty) {
                console.log('Collection does not exist');
                // untuk simpan data ke firebase
                const tblBot = collection(db, 'Bots');

                const data = {
                    uid: this.uid,
                    status: true,
                    seen: false,
                    name: 'Bot Buku Panduan Mahasiswa',
                    info: 'Snstitut Sains dan Teknologi Terpadu Surabaya',
                    photo: '/logo.png',
                    created_at: serverTimestamp(),
                    latest_message: 'Halo, saya Bot Buku Panduan Mahasiswa. Ada yang bisa saya bantu?',
                    latest_message_time: serverTimestamp(),
                }

                addDoc(tblBot, data).then((res) => {
                    const tblMessageBot = collection(db, 'Bots', res.id, 'Messages');

                    const dataMessage = {
                        uid: this.uid,
                        type: 'bot',
                        message: 'Halo, saya Bot Buku Panduan Mahasiswa. Ada yang bisa saya bantu?',
                        created_at: serverTimestamp(),
                    }

                    addDoc(tblMessageBot, dataMessage).then((res) => {
                        console.log('Document successfully written!');
                    }).catch((error) => {
                        console.error('Error writing document: ', error);
                    });

                    this.$router.push({ name: 'user-bot', params: { id: res.id } });
                });
            } else {
                console.log('Collection does exist');

                getBots.forEach((docBots) => {
                    this.$router.push({ name: 'user-bot', params: { id: docBots.id } });
                });
            }
        },
        async loadChat() {
            try {
                // untuk ambil data users
                const tblUsers = query(collection(db, 'Users'));
                const getUsers = await getDocs(tblUsers);
                this.users = getUsers.docs.map((docUsers) => ({
                    id: docUsers.id,
                    ...docUsers.data()
                }));

                // untuk ambil data friends
                const tblBots = collection(db, "Bots");
                const qryBots = query(tblBots, where('uid', '==', this.uid), orderBy('latest_message', 'desc'));

                const unsubscribe = onSnapshot(qryBots, (snapshotBots) => {
                    this.chats = [];
                    snapshotBots.docs.map((docBots) => {
                        this.chats.push({
                            id: docBots.id,
                            uid: docBots.data().uid,
                            seen: docBots.data().seen,
                            latest_message: docBots.data().latest_message,
                            name: docBots.data().name,
                            info: docBots.data().info,
                            photo: docBots.data().photo,
                        });
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