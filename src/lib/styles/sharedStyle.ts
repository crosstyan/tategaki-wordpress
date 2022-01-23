// https://tailwindcss.com/docs/reusing-styles
// but I'm really lazy
export const styles = {
  button: "flex btn bg-transparent hover:bg-transparent text-base-content hover:text-accent-focus border-base-content hover:border-accent-focus mb-2 px-1 py-3 h-auto w-auto"
}

// Why I do styles here? 
// You can find the real color scheme in 'src/tailwind.config.cjs'
// But I can't find a way to use it in the svelte component (Javascript land)
export const colors = {
  // blue-500: '#0ea5e9'
  loading: '#0ea5e9'
}
