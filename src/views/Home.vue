<template>
  <div class="home">
    <myDialog>dd</myDialog>
  </div>
</template>

<script>
// @ is an alias to /src
import myDialog from '@/components/my-dialog.vue'

export default {
  name: 'Home',
  components: {
    myDialog
  }
}
</script>
