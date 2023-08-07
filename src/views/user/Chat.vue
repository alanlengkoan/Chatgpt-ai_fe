<!-- untuk tampilan pesan -->
<script setup>
import NavbarMessage from '../../components/user/NavbarMessage.vue';
import RoomChat from '../../components/user/RoomChat.vue';
</script>

<template>
    <!-- begin:: navbar -->
    <NavbarMessage :id="id" />
    <!-- end:: navbar -->
    <!-- begin:: chat template -->
    <RoomChat :id="id" />
    <!-- end:: chat template -->
</template>

<script>
export default {
    name: 'Chat',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
}
</script>