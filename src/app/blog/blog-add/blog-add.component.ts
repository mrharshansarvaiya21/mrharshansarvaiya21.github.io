import { BlogService } from './../blog.service';
import { Component, OnInit } from '@angular/core';
import { Blog } from '../blog';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'tb-blog-add',
  templateUrl: './blog-add.component.html',
  styleUrls: ['./blog-add.component.css']
})
export class BlogAddComponent implements OnInit {

  blog: Blog = new Blog;

  heading: string = "";
  content: string = "";
  authorName: string = "";
  authorId:number=0;
  shortIntro: string = "";
  timeToRead: number = 1;
  isLoading:boolean=false;
  addBlogForm!:FormGroup ;

  constructor(private blogService: BlogService,
    private cookieService:CookieService,
    private snackBar:MatSnackBar,
    private fb: FormBuilder
    ) { }

  ngOnInit(): void {
    this.isLoading=false;
    this.addBlogForm = this.fb.group({
      heading:['',([Validators.maxLength(80)])],
      content:['',([Validators.maxLength(500)])],
      shortIntro:['',([Validators.maxLength(100)])],
      timeToRead:['',([Validators.min(1),Validators.max((15))])]
    });
  }

  openSnackBar(){
    this.snackBar.open("Blog added successfully!",'dismiss',{
      duration : 3000,
    });
  }

  openErrorSnackBar(){
    this.snackBar.open("Some errors occured, Please try again after sometime!",'dismiss',{
      duration : 3000,
    });
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.addBlogForm.controls[controlName].hasError(errorName);
  }

  addBlog(){
    this.isLoading=true;

    if(this.addBlogForm.valid){
      this.heading=this.addBlogForm.controls["heading"].value;
      this.content=this.addBlogForm.controls["content"].value;
      this.shortIntro=this.addBlogForm.controls["shortIntro"].value;
      this.timeToRead=this.addBlogForm.controls["timeToRead"].value;
      this.blog.heading=this.heading;
      this.blog.content=this.content;
      this.blog.authorName=this.cookieService.get("name");
      this.blog.authorId=Number(this.cookieService.get("id"));
      this.blog.shortIntro=this.shortIntro;
      this.blog.timeToRead=this.timeToRead;
      this.authorName=this.blog.authorName;
      this.authorId=this.blog.authorId;
      console.log("value of blog is : ",this.blog);
      this.blogService.addBlog(this.heading, this.content, this.authorName,this.authorId , this.shortIntro, this.timeToRead).subscribe({
        next : val => {
          console.log("in add method ",val);
          this.isLoading=false;
          this.openSnackBar();
        },
        error: err => {
          this.isLoading=false;
          console.log("error in add : ",err);
          this.openErrorSnackBar();
        }
      });
    }
    else{
      this.isLoading=false;
      this.addBlogForm.markAllAsTouched();
    }
  }

}
