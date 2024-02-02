
export interface Post {
    name: string
    content: string
    date: string
    comments: string
  }
  
export interface Client {
  name: string
  posts: Array<Post>
}