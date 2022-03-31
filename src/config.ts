interface AppConfig {
  url: string
  postsApi: string
  // the name displaying in title
  blogName: string
}
export const config: AppConfig = {
  // The base URL of the WordPress site
  url:"https://blog.moe.wtf",
  // The base URL of posts path
  postsApi: '/wp-json/wp/v2/posts',
  blogName: 'Crosstyanのブログ'
}

export function getPostApiUrl(config: AppConfig){
  return `${config.url}${config.postsApi}`
}