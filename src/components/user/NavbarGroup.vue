<template>
    <div class="relative flex justify-between p-3 border-b border-gray-300">
        <router-link to="/user/home" class="items-center p-2">
            <font-awesome-icon icon="fa-solid fa-arrow-left" />
        </router-link>
        <div class="relative" v-if="this.id !== ''">
            <button @click="show = !show" class="items-center p-2">
                <font-awesome-icon icon="fa-solid fa-bars" />
            </button>
            <div v-show="show" class="z-40 absolute right-0 py-2 mt-2 bg-white rounded-md shadow-xl w-44">
                <button @click="addMember(this.id)" class="block px-4 py-2 text-sm text-gray-800 hover:text-gray-400">Add Member</button>
                <button @click="leaveGroup(this.id, this.uid)" class="block px-4 py-2 text-sm text-gray-800 hover:text-gray-400">Leave Group</button>
                <button @click="deleteGroup(this.id)" class="block px-4 py-2 text-sm text-gray-800 hover:text-gray-400">Delete Group</button>
            </div>
        </div>
    </div>
</template>

<script>
import { db } from "../../firebase";
import {
    deleteDoc,
    doc,
    query,
    collection,
    where,
    onSnapshot
} from "firebase/firestore";

export default {
    name: 'NavbarGroup',
    props: {
        id: {
            type: String,
            required: true,
        },
        uid: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            show: false,
        }
    },
    methods: {
        addMember(id) {
            this.$router.push({ name: 'group-member', params: { id: id } });
        },
        leaveGroup(id, uid) {
            const qryGroupMember = query(collection(db, "Groups/" + id + "/Members"), where("uid", "==", uid));
            onSnapshot(qryGroupMember, (snapshotGroupMember) => {
                snapshotGroupMember.docs.map((docGroupMember) => {
                    deleteDoc(doc(db, "Groups/" + id + "/Members/" + docGroupMember.id));
                    this.$router.push({ name: 'home' });
                });
            });
        },
        deleteGroup(id) {
            deleteDoc(doc(db, "Groups", id));
            this.$router.push({ name: 'home' });
        },
    },
    mounted() {

    }
}
</script>