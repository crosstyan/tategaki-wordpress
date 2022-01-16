export interface Post{
  id: number,
  data:string,
  excerpt:Content,
  content:Content,
  title:Content,
  types:string
}
interface Content{
  protected?:boolean,
  rendered:string
}