<!-- untuk tampilan buat group -->
<script setup>
import NavbarGroup from '../../components/user/NavbarGroup.vue';
</script>

<template>
    <!-- begin:: navbar -->
    <NavbarGroup :id="id" :uid="uid" />
    <!-- end:: navbar -->

    <!-- begin:: chat template -->
    <div class="p-4">
        <div class="mb-6">
            <label for="name" class="block mb-2 text-sm font-medium">Name&nbsp;*</label>
            <input type="text" ref="name" @keypress.enter="createGroup" id="name"
                :class="(validasi_name ? 'border-2 border-rose-500 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5' : 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5')"
                placeholder="Group Name" required>
        </div>
        <button type="button" @click="createGroup"
            class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            :disabled="submit">{{ (submit ? 'Waiting' : 'Submit') }}</button>
    </div>
    <!-- end:: chat template -->
</template>

<script>
import { db } from "../../firebase";
import {
    collection,
    serverTimestamp,
    addDoc,
} from "firebase/firestore";
import Swal from 'sweetalert2'

export default {
    name: 'GroupCreate',
    data() {
        return {
            id: '',
            uid: '',
            submit: false,
            validasi_name: false,
        }
    },
    methods: {
        loadUser() {
            let user = JSON.parse(localStorage.getItem('user'));

            this.uid = user.uid;
        },
        createGroup() {
            try {
                if (this.$refs.name.value === '') {
                    this.validasi_name = true;

                    return;
                }

                this.submit = true;
                this.validasi_name = false;

                const tblGroups = collection(db, 'Groups');

                const data = {
                    name: this.$refs.name.value,
                    latest_message: '',
                    latest_message_time: serverTimestamp(),
                    status: true,
                    created_at: serverTimestamp(),
                }

                addDoc(tblGroups, data).then((res) => {
                    this.submit = false;

                    Swal.fire({
                        title: 'Berhasil!',
                        text: 'Group berhasil dibuat.',
                        icon: 'success',
                        confirmButtonText: 'Cool'
                    }).then((confirm) => {
                        if (confirm.isConfirmed) {
                            console.log('Group berhasil ditambahkan => ' + res.id);
                            this.$router.push({ name: 'user-group-member', params: { id: res.id } });
                        }
                    });
                });
            } catch (error) {
                console.log(error);
            }
        },
    },
    mounted() {
        this.loadUser();
    }
}
</script>