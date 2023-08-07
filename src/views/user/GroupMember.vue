<!-- untuk tampilan pencarian -->
<script setup>
import NavbarGroup from '../../components/user/NavbarGroup.vue';
import Loading from '../../components/Loading.vue';
</script>

<template>
    <!-- begin:: navbar -->
    <NavbarGroup :id="id" :uid="uid" />
    <!-- end:: navbar -->

    <!-- begin:: search -->
    <div class="p-4">
        <div class="relative flex justify-between">
            <input type="text" ref="search" @keypress.enter="searchFriends" :placeholder="search"
                :class="(validasi_search ? 'border-2 border-rose-500 mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5' : 'mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5')"
                required>
            <button type="button" @click="searchFriends"
                class="mr-2 text-white right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
            <button type="button" @click="finish"
                class="text-white right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Done</button>
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
                            @click="addInGroup(row.uid)">Add</button>
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
    serverTimestamp,
    addDoc,
} from "firebase/firestore";
import Swal from 'sweetalert2'

export default {
    name: 'GroupMember',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            loading: true,
            search: 'Search Friends',
            validasi_search: false,
            uid: '',
            users: [],
        }
    },
    methods: {
        loadUser() {
            let user = JSON.parse(localStorage.getItem('user'));

            this.uid = user.uid;
        },
        async finish() {
            const tblMembers = collection(db, 'Groups/' + this.id + '/Members');
            const qryMembers = query(tblMembers, where('uid', '==', this.uid));
            const getMembers = await getDocs(qryMembers);

            if (getMembers.empty) {
                // untuk simpan data ke firebase
                const tblGroupMember = collection(db, 'Groups/' + this.id + '/Members');

                const data = {
                    uid: this.uid,
                    seen: false,
                    status: true,
                    created_at: serverTimestamp(),
                }

                addDoc(tblGroupMember, data).then((res) => {
                    console.log('Group Member berhasil ditambahkan => ' + res.id);

                    this.$router.push({ name: 'user-group', params: { id: this.id } });
                });
            } else {
                console.log('Collection does exist');

                this.$router.push({ name: 'user-group', params: { id: this.id } });
            }
        },
        async addInGroup(uid) {
            try {
                const tblGroupMember = collection(db, 'Groups/' + this.id + '/Members');
                const getGroupMember = query(tblGroupMember, where('uid', '==', uid));
                const resGroupMember = await getDocs(getGroupMember);

                if (resGroupMember.empty) {
                    console.log('Collection does not exist');

                    const data = {
                        uid: uid,
                        seen: false,
                        status: true,
                        created_at: serverTimestamp(),
                    }

                    addDoc(tblGroupMember, data).then((res) => {
                        Swal.fire({
                            title: 'Berhasil!',
                            text: 'Member berhasil ditambahkan',
                            icon: 'success',
                            confirmButtonText: 'Cool'
                        }).then((confirm) => {
                            if (confirm.isConfirmed) {
                                console.log('Group Member berhasil ditambahkan => ' + res.id);
                            }
                        });
                    });
                } else {
                    console.log('Collection does exist');

                    Swal.fire({
                        title: 'Gagal!',
                        text: 'Member sudah ada',
                        icon: 'warning',
                        confirmButtonText: 'Cool'
                    }).then((confirm) => {
                        if (confirm.isConfirmed) {
                            resGroupMember.forEach((doc) => {
                                console.log(doc.id, ' => ', doc.data());
                            });
                        }
                    });
                }
            } catch (error) {
                console.log(error);
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