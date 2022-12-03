import { BlogService } from './../blog.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from '../blog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tb-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.css']
})
export class BlogDetailComponent implements OnInit {


  blog: Blog | undefined;
  blogs: Blog[]=[];
  errorMessage: string = '';
  sub!: Subscription;
  isLoading:boolean=false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private blogSerice:BlogService) { }

  ngOnInit(): void {
    this.isLoading=true;
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.blogSerice.getBlogs().subscribe({
      next : blogs => {
        this.blogs = blogs;
        this.blog = this.blogs.find(blog => blog.id===id);
        this.isLoading=false;
      },
      error: err => this.errorMessage = err
    });
  }

  onBack(): void {
    this.router.navigate(['/blogs']);
  }

}
