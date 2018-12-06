import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  title = '';
  content = '';
  post: Post;
  private isEdit = false;
  private postId: string;
  // @Output() postCreated = new EventEmitter<Post>();

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isEdit = paramMap.has('postId');
      this.postId = this.isEdit ? paramMap.get('postId') : null;
      this.post = this.postId ? this.postService.getPost(this.postId) : null;
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isEdit
      ? this.postService.updatePost(this.postId, form.value.title, form.value.content)
      : this.postService.addPosts(form.value.title, form.value.content);

      form.resetForm();
  }
}
