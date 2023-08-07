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
                    <th>Uid</th>
                    <th>Nama</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in users" :key="row.id">
                    <td>{{ row.id }}</td>
                    <td>{{ row.uid }}</td>
                    <td>{{ row.name }}</td>
                    <td>{{ row.email }}</td>
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
} from "firebase/firestore";

export default {
    name: 'User',
    data() {
        return {
            crumbs: [
                { 'link': '/admin/dashboard', 'name': 'Dashboard' },
                { 'link': '#', 'name': 'User' },
            ],
            users: [],
        }
    },
    methods: {
        async getData() {
            const tblUsers = collection(db, 'Users');
            const qryUsers = query(tblUsers);
            const getUsers = await getDocs(qryUsers);

            if (!getUsers.empty) {
                onSnapshot(qryUsers, (snapshot) => {
                    this.users = [];
                    snapshot.docs.forEach(doc => {
                        this.users.push({
                            id: doc.id,
                            uid: doc.data().uid,
                            name: doc.data().name,
                            email: doc.data().email,
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
