<script setup>
import Breadcrumb from "../../components/admin/Breadcrumb.vue";
</script>

<template>
    <!-- begin:: breadcrumb -->
    <Breadcrumb :crumbs="crumbs" />
    <!-- end:: breadcrumb -->

    <div class="w-full bg-white border rounded-lg p-4">
        <table class="table-auto w-full text-center">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Receiver</th>
                    <th>Sender</th>
                    <th>Latest Message</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in chats" :key="row.id">
                    <td>{{ row.id }}</td>
                    <td>{{ row.receiver }}</td>
                    <td>{{ row.sender }}</td>
                    <td>{{ row.latest_message }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { db } from "../../firebase";
import {
    collection,
    query,
    getDocs,
    onSnapshot,
    orderBy,
} from "firebase/firestore";

export default {
    name: 'Chat',
    data() {
        return {
            crumbs: [
                { 'link': '/admin/dashboard', 'name': 'Dashboard' },
                { 'link': '#', 'name': 'Chat' },
            ],
            chats: [],
            users: [],
        }
    },
    methods: {
        async getData() {
            // untuk ambil data users
            const tblUsers = query(collection(db, 'Users'));
            const getUsers = await getDocs(tblUsers);
            this.users = getUsers.docs.map((docUsers) => ({
                id: docUsers.id,
                ...docUsers.data()
            }));

            const tblFriends = collection(db, 'Friends');
            const qryFriends = query(tblFriends, orderBy('latest_message_time', 'desc'));
            const getFriends = await getDocs(qryFriends);

            if (!getFriends.empty) {
                onSnapshot(qryFriends, (snapshot) => {
                    this.chats = [];
                    snapshot.docs.forEach(doc => {
                        const receiver = this.users.find(user => user.uid === doc.data().id_receiver);
                        const sender = this.users.find(user => user.uid === doc.data().id_sender);
                        
                        this.chats.push({
                            id: doc.id,
                            receiver: receiver.name,
                            sender: sender.name,
                            latest_message: doc.data().latest_message,
                        });
                    });
                });
            } else {
                console.log('No matching documents.');
            }
        },
    },
    mounted() {
        this.getData();
    },
}
</script>
