<script setup>
    import Loading from "./../Loading.vue";
</script>

<template>
    <div :class="loading ? 'hidden' : 'flex items-center justify-center h-screen'">
        <Loading />
    </div>
    <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
        <ul class="space-y-2">
            <li v-bind:class="(row.uid === uid ? 'flex justify-end' : 'flex justify-start')"
                v-for="row in messages" :key="row.id">
                <div v-bind:class="(row.uid === uid ? 'relative max-w-xl px-4 py-2 text-gray-700 rounded shadow' : 'relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow')">
                    <span class="block">{{ row.message }}</span>
                    <p class="text-xs text-right text-gray-400">{{ convertDate(row.created_at) }}</p>
                </div>
            </li>
            <div ref="bottom"></div>
        </ul>
    </div>
    <div class="relative flex items-center justify-between w-full p-3 border-t border-gray-300">
        <input type="text" class="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
            ref="message" @keypress.enter="sendMessage" :placeholder="message" required />
        <button type="submit" @click="sendMessage">
            <font-awesome-icon icon="fa-solid fa-paper-plane" />
        </button>
    </div>
</template>

<script>
import { db } from "../../firebase";
import http from '../../axios';
import {
    collection,
    orderBy,
    onSnapshot,
    query,
    updateDoc,
    doc,
    getDoc
} from "firebase/firestore";
import { ref, onUnmounted, nextTick } from 'vue';

export default {
    name: 'RoomChat',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            message: 'Message',
            messages: ref([]),
            uid: '',
        }
    },
    methods: {
        loadUser() {
            let user = JSON.parse(localStorage.getItem('user'));

            this.uid = user.uid;
        },
        async loadMessage() {
            try {
                const tblFriends = doc(db, "Friends", this.id);
                const getFriends = await getDoc(tblFriends);

                if (getFriends.exists()) {
                    console.log('Collection does exist');

                    updateDoc(doc(db, "Friends", this.id), {
                        seen: true,
                    });

                    const qryMessages = query(collection(db, "Friends/" + this.id + "/Messages"), orderBy('created_at', 'asc'));
                    const unsubscribe = onSnapshot(qryMessages, (querySnapshot) => {
                        this.messages = querySnapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data()
                        }));

                        nextTick(() => {
                            this.$refs.bottom?.scrollIntoView({
                                behavior: 'smooth'
                            });
                        });

                        this.loading = true;
                    });

                    onUnmounted(unsubscribe);
                } else {
                    console.log('Collection does not exist');

                    this.$router.push({ name: 'home' });
                }
            } catch (error) {
                console.log(error);
            }
        },
        sendMessage() {
            try {
                if (this.$refs.message.value === '') {
                    return;
                }

                const data = {
                    id: this.id,
                    uid: this.uid,
                    message: this.$refs.message.value,
                }

                http.post('/send/chat', data).then((response) => {
                    console.log(response.data);
                });

                this.$refs.bottom?.scrollIntoView({ behavior: 'smooth' });
                this.$refs.message.value = '';
            } catch (error) {
                console.log(error);
            }
        },
        convertDate(date) {
            if (date === null) {
                return '';
            } else {
                let convertDate = date.toDate();
                let d = new Date(convertDate);
                let hours = d.getHours();
                let minutes = d.getMinutes();
                let seconds = d.getSeconds();
                let ampm = hours >= 12 ? 'PM' : 'AM';
                let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm;
                return strTime;
            }
        },
    },
    mounted() {
        this.loadUser();
        this.loadMessage();
    }
}
</script>