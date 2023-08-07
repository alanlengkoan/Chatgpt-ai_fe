<!-- untuk tampilan pesan -->
<script setup>
import NavbarGroup from '../../components/user/NavbarGroup.vue';
import RoomGroup from '../../components/user/RoomGroup.vue';
</script>

<template>
    <!-- begin:: navbar -->
    <NavbarGroup :id="id" :uid="uid" />
    <!-- end:: navbar -->
    <!-- begin:: chat template -->
    <RoomGroup :id="id" />
    <!-- end:: chat template -->
</template>

<script>
export default {
    name: 'Group',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            uid: '',
        }
    },
    methods: {
        loadUser() {
            let user = JSON.parse(localStorage.getItem('user'));

            this.uid = user.uid;
        },
    },
    mounted() {
        this.loadUser();
    }
}
</script>