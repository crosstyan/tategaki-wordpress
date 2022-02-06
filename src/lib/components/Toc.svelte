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
  export let isForcedOpen = false
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
  // Only support h2 and h3 for now
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
<!-- svelte-ignore css-unused-selector -->
<style lang="postcss">
.collapse-content {
  max-height: none;
  padding: 0;
  padding-top: 2rem;
  padding-bottom: 2rem;
  padding-left: 0;
  max-width: 0;
}
.collapse-open .collapse-content,.collapse:focus:not(.collapse-close) .collapse-content,.collapse:not(.collapse-close) input[type=checkbox]:checked~.collapse-content {
  max-width: 9000px;
  padding-left: 1rem;
}

.collapse-title, .collapse>input[type=checkbox] {
  padding: 3rem 1rem 1rem 1rem;
}
.collapse-plus .collapse-title:after {
  top: 1.5rem;
  right: 0.9rem;
}
</style>


{#if headingElements.length > 0}
<div class="collapse border rounded-box border-base-content {isForcedOpen? " collapse-open" : " collapse-plus"}">
  <input type="checkbox"> 
  <div class="collapse-title font-bold text-xl">
    目录
  </div>
  <div class="collapse-content">
    <ul class="marker:text-accent marker:text-sm font-bold">
      {#each headings as heading}
        <li>
          <a class="hover:text-accent transition-colors" href="#{heading.id}" on:click={(e) => smoothScrollToPosition(e, heading.id)}>{heading.text}</a>
          {#if heading.childs.length > 0}
            <ul class="list-disc pt-6 font-normal">
              {#each heading.childs as child}
                <li>
                  <a class="hover:text-accent transition-colors" href="#{child.id}" on:click={(e) => smoothScrollToPosition(e, child.id)}>{child.text}</a>
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