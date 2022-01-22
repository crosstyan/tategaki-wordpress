export interface Post{
  id: number
  // "date": "2021-08-05T01:55:36",
  date:string
  // "date_gmt": "2021-08-04T17:55:36",
  date_gmt:string
  // "modified": "2021-08-05T18:20:38",
  modified:string
  modified_gmt:string
  // "link": "https://blog.moe.wtf/2021/08/2376/",
  link:string
  // "guid": {
  //   "rendered": "https://blog.moe.wtf/?p=2376"
  // },
  guid:Content
  slug:string
  author: number
  date_gmt: string
  excerpt:Content
  content:Content
  title:Content
  types:string
  _links: Links
  _embedded: Embed
}
interface Content{
  protected?:boolean,
  rendered:string
}
interface Links {
  self: Link[]
  collection: Link[]
  about: Link[]
  author: Link[]
  replies: Link[]
  // there is no need of these property
  // 'version-history': Link[]
  // 'predecessor-version': Link[]
}

interface Link {
  href:string
}

interface Author {
  description:string
  id:number
  link:string
  name:string
  slug:string
  url:string
}

interface Embed {
  author: Author[]
  'wp:featuredmedia'?: FeaturedMedia
}

interface FeaturedMedia {
  id:number
  date:string
  slug:string
  type:string
  link:string
  title:Content
  author:number
  caption:Content
  alt_text:string
  media_type:string
  mime_type:string
  source_url:string
}