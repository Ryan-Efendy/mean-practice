import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Post } from '../post.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})
export class PostCreateComponent implements OnInit {
  title = '';
  content = '';
  post: Post;
  isLoading = false;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;
  private isEdit = false;
  private postId: string;
  // @Output() postCreated = new EventEmitter<Post>();

  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.isEdit = paramMap.has('postId');
      this.postId = this.isEdit ? paramMap.get('postId') : null;
      this.isLoading = true;
      this.postId
        ? this.postService.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.post = { id: postData._id, title: postData.title, content: postData.content, imagePath: postData.imagePath };
            this.form.setValue({ title: this.post.title, content: this.post.content, image: this.post.imagePath });
          })
        : (this.isLoading = false);
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.isEdit
      ? this.postService.updatePost(this.postId, this.form.value.title, this.form.value.content, this.form.value.image)
      : this.postService.addPosts(this.form.value.title, this.form.value.content, this.form.value.image);

    this.form.reset();
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
