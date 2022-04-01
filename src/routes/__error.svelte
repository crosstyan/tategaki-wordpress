<script context="module" lang="ts">
  export function load({ error, status }: { error: Error; status: number }) {
      return {
          props: {
              message: error.message,
              status // same as status: status
          }
      }
  }
</script>

<script lang="ts">
  import ErrorPrompt from "@/lib/components/ErrorPrompt.svelte"
  export let message:string
  export let status:number
</script>

<ErrorPrompt code={status} msg={message}/>