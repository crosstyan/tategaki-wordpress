<script lang="ts">
  import {config} from "../../config"
  import { iOS } from "../utils/utils"
  import Breadcrumbs from "./Breadcrumbs.svelte"
  import { globalHistory, Link } from 'svelte-navigator'
  import { onMount, onDestroy } from 'svelte'

  let pathname:string
  // https://github.com/mefechoel/svelte-navigator/issues/40
  const historyStore = { subscribe: globalHistory.listen }

  function subscribePathname({location, action}) {
    pathname = location.pathname
  }

  /**
   * Unsubscribe a listener function.
   * It won't be called on any future updates
   */
  // type Unlisten = () => void;
  const unlisten = historyStore.subscribe(subscribePathname)

  onDestroy(unlisten)

</script>

<style lang="postcss">
</style>

<header>
  <!-- a dummy div to give some space -->
  <div class="pr-8"></div>
  <nav
    class="navbar my-12 md:my-8 md:px-8 shadow-lg bg-primary text-primary-content rounded-box font-sans justify-between"
  >
    <Link to="/">
      <div class="flex-1 py-2 my-2 ">
        <span class="text-lg md:text-4xl font-bold font-serif hover:text-primary-focus opacity-90 transition-all duration-500">
          {config.blogName}</span
        >
      </div>
    </Link>
    <div class="dropdown dropdown-top dropdown-end" style="writing-mode: horizontal-tb;">
      <div tabindex="0" class="flex-none">
        <button class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">      
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>                    
          </svg>
        </button>
      </div>
      <ul tabindex="0" class="z-50 p-2 shadow menu dropdown-content bg-secondary text-secondary-content rounded-box w-52">
        <li>
          <!-- svelte-ignore a11y-missing-attribute -->
          <a class="active:bg-secondary-focus active:text-secondary" data-toggle-theme="dark,light">Toggle Dark mode</a>
        </li> 
        <!-- <li>
          <a href="#" on:click|preventDefault={doNothing}>Do Nothing</a>
        </li>  -->
      </ul>
    </div>
  </nav>

  <div class="my-16 mr-2 md:mr-4 md:my-16 font-sans">
    <Breadcrumbs {pathname} />
  </div>
  {#if iOS()}
    <div class="my-16 mx-4 md:mr-8 md:my-8">
      <p class="font-serif">致 iOS 用户：由于浏览器的限制，Safari 浏览器无法正确渲染本网页，若遇到代码或者表格无法滚动或标点渲染异常，亦或是按钮渲染错误，请勿惊慌，此乃已知问题。</p>
      <p class="font-serif text-sm">若欲查看源代码请点击 View Source 按钮。</p>
    </div>
  {/if}
</header>