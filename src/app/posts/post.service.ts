import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs'; // like EventEmitter
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  // immutable
  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(`http://localhost:3000/api/posts${queryParams}`)
      .pipe(
        map(postData => {
          return {
            posts: postData.posts.map(({ title, content, _id: id, imagePath, creator }) => {
              return {
                title,
                content,
                id,
                imagePath,
                creator,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe(transformedPostData => {
        // console.log(transformedPostData);
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts,
        });
      });
  }

  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http.post<{ message: string; post: Post }>('http://localhost:3000/api/posts', postData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(`http://localhost:3000/api/posts/${postId}`);
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string; title: string; content: string; imagePath: string }>(
      `http://localhost:3000/api/posts/${postId}`
    );
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
