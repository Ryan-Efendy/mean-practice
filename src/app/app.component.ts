import { Component } from '@angular/core';
import { Post } from './posts/post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  posts: Post[] = [
    // { title: 'first post', content: 'this is the first\'s post content' },
    // { title: 'first post', content: 'this is the first\'s post content' },
    // { title: 'first post', content: 'this is the first\'s post content' }
  ];

  onPostAdded(post: Post) {
    this.posts.push(post);
  }
}
