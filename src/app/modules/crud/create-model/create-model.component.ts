import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CrudServiceService } from '../crud-service.service';

@Component({
  selector: 'app-create-model',
  templateUrl: './create-model.component.html',
  styleUrls: ['./create-model.component.css']
})
export class CreateModelComponent implements OnInit {
  folderForm!: FormGroup;
  router: string | undefined;
  showLoader:boolean = false;

  constructor(private route: Router, private fb: FormBuilder,private folderCrudService: CrudServiceService,private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.initForm();
    this.router = this.route.url;
    // this code for update route
    if(this.route.url != '/create'){
      this.folderForm.controls['oldFolderName'].setValidators(
        [Validators.required, 
        Validators.minLength(3),Validators.maxLength(50)]
      );
      this.folderForm.updateValueAndValidity();
      this.activeRoute.params.subscribe((params: any) => {
        this.folderForm.setValue({
          oldFolderName: localStorage.getItem('folderName')+ '/' + params.name,
          newFolderName: ''
        })
      });  
    } else {
      // this code for create route
      this.folderForm.reset();
    }
  }

  async initForm() {
    this.folderForm = this.fb.group({
      newFolderName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ]),
      ],
      oldFolderName: [
        ''
      ],
    });
    this.folderForm.updateValueAndValidity();
  }
  get f() {
    if(this.folderForm)
      return this.folderForm.controls;
    return false;
  }

  // Back to list screen
  onCancel(): void {
    this.route.navigate(['/list']);
  }

  // Create new folder function
  onAdd(): void {
    this.folderForm.markAllAsTouched();
    if(this.folderForm.valid) {
      this.showLoader = true;
      this.folderCrudService.createFolder(this.folderForm.controls['newFolderName'].value).subscribe(() => {
        this.showLoader = false;
        this.route.navigate(['/list']);
      });
    }
  }

  // Update folder name
  onUpdate(): void {
    this.folderForm.markAllAsTouched();
    if(this.folderForm.valid) {
      this.showLoader = true;
      this.folderCrudService.updateFolder(this.folderForm.controls['oldFolderName'].value,this.folderForm.controls['newFolderName'].value).subscribe((data) => {
        this.showLoader = false;
        this.route.navigate(['/list']);
      });
    }
  }
}
