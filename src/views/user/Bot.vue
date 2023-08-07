<!-- untuk tampilan pesan -->
<script setup>
import NavbarBot from '../../components/user/NavbarBot.vue';
import RoomBot from '../../components/user/RoomBot.vue';
</script>

<template>
    <!-- begin:: navbar -->
    <NavbarBot :id="id" />
    <!-- end:: navbar -->
    <!-- begin:: chat template -->
    <RoomBot :id="id" />
    <!-- end:: chat template -->
</template>

<script>
export default {
    name: 'Bot',
    props: {
        id: {
            type: String,
            required: true,
        },
    },
}
</script>