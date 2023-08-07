<script setup>
import Loading from "./../Loading.vue";
</script>

<template>
    <div :class="loading ? 'hidden' : 'flex items-center justify-center h-screen'">
        <Loading />
    </div>
    <div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
        <ul class="space-y-2" ref="messagges">
            <li v-bind:class="(row.uid === uid ? 'flex justify-end' : 'flex justify-start')" v-for="row in messages" :key="row.id">
                <div v-bind:class="(row.uid === uid ? 'relative max-w-xl px-4 py-2 text-gray-700 rounded shadow' : 'relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow')">
                    <h2 class="font-bold text-lg">{{ row.name }} <span class="text-xs">({{ row.email }})</span></h2>
                    <span class="block">{{ row.message }}</span>
                    <p class="text-xs text-right text-gray-400">{{ convertDate(row.created_at) }}</p>
                </div>
            </li>
            <div ref="bottom"></div>
        </ul>
    </div>
    <div class="relative flex items-center justify-between w-full p-3 border-t border-gray-300">
        <input type="text" class="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700" ref="message" @keypress.enter="sendMessage" :placeholder="message" required />
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
    getDocs,
    where,
    getDoc,
} from "firebase/firestore";
import { ref, onUnmounted, nextTick } from 'vue';

export default {
    name: 'RoomGroup',
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
            users: [],
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
                const tglGoups = doc(db, "Groups", this.id);
                const getGroup = await getDoc(tglGoups);

                if (getGroup.exists()) {
                    console.log('Collection does exist');

                    const tblMembers = collection(db, 'Groups/' + this.id + '/Members');
                    const qryMembers = query(tblMembers, where('uid', '==', this.uid));
                    const getMembers = await getDocs(qryMembers);
                    getMembers.docs.map((docMembers) => {
                        if (docMembers.data().seen === false) {
                            const docRef = doc(db, "Groups/" + this.id + "/Members", docMembers.id);
                            updateDoc(docRef, {
                                seen: true
                            }).then(() => {
                                console.log("Document successfully updated!");
                            }).catch((error) => {
                                console.error("Error updating document: ", error);
                            });
                        }
                    });

                    // untuk ambil data users
                    const tblUsers = query(collection(db, 'Users'));
                    const getUsers = await getDocs(tblUsers);
                    this.users = getUsers.docs.map((resUsers) => ({
                        id: resUsers.id,
                        ...resUsers.data()
                    }));

                    const qryMessages = query(collection(db, "Groups/" + this.id + "/Messages"), orderBy('created_at', 'asc'));
                    const unsubscribe = onSnapshot(qryMessages, (querySnapshot) => {
                        this.messages = querySnapshot.docs.map((doc) => {
                            let user = this.users.find((user) => user.uid === doc.data().uid);

                            return {
                                id: doc.id,
                                ...doc.data(),
                                name: user.name,
                                email: user.email,
                                photo: user.photo
                            }
                        });

                        nextTick(() => {
                            this.$refs.bottom?.scrollIntoView({
                                behavior: 'smooth'
                            });
                        });
                    });

                    this.loading = true;

                    onUnmounted(unsubscribe);
                } else {
                    console.log('Collection does not exist');

                    this.$router.push({ name: 'home' });
                }
            } catch (error) {
                console.log(error);
            }
        },
        async sendMessage() {
            try {
                if (this.$refs.message.value === '') {
                    return;
                }

                const data = {
                    id: this.id,
                    uid: this.uid,
                    message: this.$refs.message.value,
                }

                http.post('/send/group', data).then((response) => {
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