<script setup>
import Loading from "./../Loading.vue";
</script>

<template>
    <div :class="loading ? 'hidden' : 'flex items-center justify-center h-screen'">
        <Loading />
    </div>
    <div class="px-4 flex flex-col flex-grow h-0 overflow-auto">
        <div v-if="groups.length !== 0">
            <ul class="space-y-4">
                <li :class="row.seen ? 'bg-white rounded-lg shadow-md p-4' : 'bg-blue-100 rounded-lg shadow-md p-4'" v-for="row in groups" :key="row.id" @click="openGroup(row.id)">
                    <div class="flex items-center mb-2">
                        <h2 class="font-bold text-lg">{{ row.name }}</h2>
                    </div>
                    <p class="text-gray-600">
                        {{ row.latest_message }}
                    </p>
                </li>
            </ul>
        </div>
        <div v-else class="flex items-center justify-center h-screen">
            <div class="p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">
                <span class="font-medium">No</span> Groups.
            </div>
        </div>
    </div>
    <div class="relative">
        <router-link to="/user/group/create" class="absolute bottom-2 right-4 bg-gray-600 w-10 h-10 rounded-full drop-shadow-lg flex justify-center items-center text-white text-xl hover:bg-gray-700 hover:drop-shadow-2xl">
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
    onSnapshot,
    orderBy,
} from "firebase/firestore";
import { onUnmounted, ref } from 'vue';

export default {
    name: 'Groups',
    props: {
        uid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            loading: false,
            groups: ref([]),
        }
    },
    methods: {
        openGroup(id) {
            this.$router.push({ name: 'user-group', params: { id: id } });
        },
        async loadGroup() {
            try {
                // untuk ambil data friends
                const tblGroups = collection(db, "Groups");
                const qryGroups = query(tblGroups, orderBy('latest_message_time', 'desc'));

                const unsubscribe = onSnapshot(qryGroups, (snapshotGroups) => {
                    snapshotGroups.docs.map(async (docGroups) => {
                        const qryGroupMember = query(collection(db, "Groups/" + docGroups.id + "/Members"), where("uid", "==", this.uid));

                        this.groups = [];
                        onSnapshot(qryGroupMember, (snapshotGroupMember) => {
                            snapshotGroupMember.docs.map((docGroupMember) => {
                                this.groups.push({
                                    id: docGroups.id,
                                    name: docGroups.data().name,
                                    latest_message: docGroups.data().latest_message,
                                    latest_message_time: docGroups.data().latest_message_time,
                                    seen: docGroupMember.data().seen,
                                });
                            });
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
        this.loadGroup();
    }
}
</script>