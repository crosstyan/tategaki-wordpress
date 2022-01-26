<script lang="ts">
  // https://www.emgoto.com/react-table-of-contents/
  // https://github.com/janosh/svelte-toc
  // It's going to be a simple TOC before every post content
  // No floating TOC, just a fixed one
  // No IntersectionObserver
  // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
  import { generateRandomFixedLengthString } from "../utils/utils"
  import { onMount } from 'svelte'
  export let headingElements: HTMLElement[] = []
  let headings:Heading[] = []

  onMount(async () => {
    addIDs(headingElements)
    headings = getHeadings(headingElements)
  })

  function smoothScrollToPosition(event: Event, id: string){
    event.preventDefault()
    const element = document.getElementById(id)
    element.scrollIntoView({
      behavior: "smooth"
    });
  }

  interface Heading {
    text: string
    id: string
    childs?: Heading[]
  }

  function addIDs(element: HTMLElement[]) {
    element.forEach((element)=>{
      if(element.id === ""){
        element.id = `${element.innerText}-${generateRandomFixedLengthString()}`
      }
    })
  }

  // TODO: recursive?
  function getHeadings(headingElements: HTMLElement[]) {
    const headings: Heading[] = []
    headingElements.forEach((headingElement) => {
      const heading: Heading = {
        text: headingElement.innerText,
        id: headingElement.id,
        childs: []
      }
      if (headingElement.tagName === "H2") {
        headings.push(heading)
      } else if (headingElement.tagName === "H3" && headings.length > 0) {
        // get the last element in headings
        headings[headings.length - 1].childs.push({
          text: headingElement.innerText,
          id: headingElement.id,
        })
      }
    })
    return headings
  }
</script>

<style lang="postcss">
</style>


{#if headingElements.length > 0}
<div class="card card-bordered mr-4">
  <div class="card-body columns:3">
    <!-- <div class="card-title font-bold text-2xl">
      Table of Contents
    </div> -->
    <ul class="font-bold">
      {#each headings as heading}
        <li>
          <a href="#{heading.id}" on:click={(e) => smoothScrollToPosition(e, heading.id)}>{heading.text}</a>
          {#if heading.childs.length > 0}
            <ul class="list-disc pt-6 font-normal">
              {#each heading.childs as child}
                <li>
                  <a href="#{child.id}" on:click={(e) => smoothScrollToPosition(e, child.id)}>{child.text}</a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</div>
{/if}