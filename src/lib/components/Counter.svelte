<script lang="ts">
  let count: number = 0
  const increment = () => {
    count += 1
  }
</script>

<button on:click={increment}>
  Clicks: {count}
</button>

<style lang="postcss">
  /* 
  You don't have to import these since it has been imported in the `app.css`
  @tailwind base;
  @tailwind components;
  @tailwind utilities; 
  */
  button {
    @apply py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75;
  }
</style>
