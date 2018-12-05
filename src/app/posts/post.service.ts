import { Injectable } from '@angular/core';
import { Post } from './post.model';
import {Subject} from 'rxjs'; // like EventEmitter

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor() {}

  // immutable
  getPosts() {
    return [...this.posts];
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, content: string) {
    const post: Post = { title, content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
