<!-- untuk tampilan pencarian -->
<script setup>
import NavbarMessage from '../../components/user/NavbarMessage.vue';
import Loading from '../../components/Loading.vue';
</script>

<template>
    <!-- begin:: navbar -->
    <NavbarMessage :id="id" />
    <!-- end:: navbar -->

    <!-- begin:: search -->
    <div class="p-4">
        <label for="default-search"
            class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <font-awesome-icon icon="fa-solid fa-search" />
            </div>
            <input type="text" ref="search" @keypress.enter="searchFriends" :placeholder="search" id="default-search"
                :class="(validasi_search ? 'border-2 border-rose-500 block w-full p-4 pl-10 text-sm rounded-lg focus:border-blue-500' : 'block w-full p-4 pl-10 text-sm border border-gray-100 rounded-lg bg-gra focus:border-blue-500 bg-gray-100 border-gray-600 placeholder-gray-400 focus:border-blue-500')"
                required>
            <button type="submit" @click="searchFriends"
                class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
        </div>
    </div>
    <!-- end:: search -->

    <!-- begin:: search result -->
    <div :class="loading ? 'hidden' : 'flex items-center justify-center h-screen'">
        <Loading />
    </div>
    <div class="p-4 flex flex-col flex-grow h-0 overflow-auto">
        <div class="container mx-auto">
            <ul class="space-y-4">
                <li class="bg-white rounded-lg shadow-md p-4" v-for="row in users" :key="row.id">
                    <div class="flex justify-between">
                        <div class="flex item-center">
                            <img class="h-12 w-12 rounded-full object-cover mr-2" :src="row.photo" :alt="row.name">
                            <div>
                                <h2 class="font-bold text-lg">{{ row.name }}</h2>
                                <p class="text-gray-500">{{ row.email }}</p>
                            </div>
                        </div>
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg"
                            @click="sendMessage(uid, row.uid)">Send</button>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <!-- end:: search result -->
</template>


<script>
import { db } from "../../firebase";
import {
    collection,
    query,
    getDocs,
    where,
    or,
    serverTimestamp,
    addDoc,
    and
} from "firebase/firestore";

export default {
    name: 'ChatCreate',
    data() {
        return {
            loading: true,
            search: 'Enter email to find friends',
            validasi_search: false,
            id: '',
            uid: '',
            nama: '',
            email: '',
            photoURL: '',
            users: [],
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
        async sendMessage(idSender, idReceiver) {
            const tblFriends = collection(db, 'Friends');
            const qryFriends = query(
                tblFriends,
                or(
                    and(
                        where('id_sender', '==', idSender),
                        where('id_receiver', '==', idReceiver),
                    ),
                    and(
                        where('id_sender', '==', idReceiver),
                        where('id_receiver', '==', idSender),
                    ),
                )
            );
            const getFriends = await getDocs(qryFriends);

             if (getFriends.empty) {
                console.log('Collection does not exist');

                const friendsAdd = {
                    id_sender: idSender,
                    id_receiver: idReceiver,
                    latest_message: '',
                    latest_message_time: serverTimestamp(),
                    seen: false,
                    status: true,
                }

                addDoc(tblFriends, friendsAdd).then((res) => {
                    this.$router.push({ name: 'user-chat', params: { id: res.id } });

                    console.log('Friends berhasil ditambahkan => ' + res.id);
                });
            } else {
                console.log('Collection does exist');

                getFriends.forEach((doc) => {
                    this.$router.push({ name: 'user-chat', params: { id: doc.id } });
                });
            }
        },
        async searchFriends() {
             try {
                if (this.$refs.search.value === '') {
                    this.validasi_search = true;

                    return;
                }

                this.loading = false;

                // untuk ambil data users
                const qryUsers = query(collection(db, 'Users'), where('uid', '!=', this.uid));
                const getUsers = await getDocs(qryUsers);
                const resUsers = getUsers.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // untuk ambil data friends
                this.users = [];
                resUsers.forEach((user) => {
                    if (user.email.toLowerCase().includes(this.$refs.search.value.toLowerCase())) {
                        this.users.push({
                            id: user.id,
                            uid: user.uid,
                            name: user.name,
                            email: user.email,
                            photo: user.photo,
                        });
                    }
                });

                this.validasi_search = false;
                this.loading = true;
            } catch (error) {
                console.log(error);
            }
        }
    },
    mounted() {
        this.loadUser();
    }
}
</script>