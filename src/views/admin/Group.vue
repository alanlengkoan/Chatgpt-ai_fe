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
                    <th>Name</th>
                    <th>Latest Message</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in groups" :key="row.id">
                    <td>{{ row.id }}</td>
                    <td>{{ row.name }}</td>
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
    name: 'Group',
    data() {
        return {
            crumbs: [
                { 'link': '/admin/dashboard', 'name': 'Dashboard' },
                { 'link': '#', 'name': 'Group' },
            ],
            groups: [],
        }
    },
    methods: {
        async getData() {
            const tblGroups = collection(db, 'Groups');
            const qryGroups = query(tblGroups, orderBy('created_at', 'desc'));
            const getGroups = await getDocs(qryGroups);

            if (!getGroups.empty) {
                onSnapshot(qryGroups, (snapshot) => {
                    this.groups = [];
                    snapshot.docs.forEach(doc => {
                        this.groups.push({
                            id: doc.id,
                            name: doc.data().name,
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
