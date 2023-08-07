<template>
    <div class="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800">
        <div class="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
            <RouterView />
        </div>
    </div>
</template>


<script>
export default {
    name: 'BaseUser',
}
</script>