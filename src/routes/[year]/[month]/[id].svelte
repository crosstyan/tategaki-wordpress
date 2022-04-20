<script lang="ts">
  // NOTE: about theme color
  // https://github.com/saadeghi/daisyui/blob/master/src/colors/themes.js

</script>
<script context="module" lang="ts">
  export async function load({ params }: 
  {params:{year:string, month:string, id:string}}) {
    return {
      status: 301,
      redirect: `/post/${params.id}`
    }
  }
</script>
