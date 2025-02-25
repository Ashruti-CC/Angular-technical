import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { CrudServiceService } from './crud-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { LoaderService } from '../loader/loader.service';

interface TableElement {
  name: string;
  type: string;
}

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})

export class CrudComponent implements OnInit {
  displayedColumns: string[] = ['name','action'];
  dataSource = new MatTableDataSource();
  path: string = '';
  show: boolean = false;
  showdbclick: boolean = false;

  constructor(private folderCrudService: CrudServiceService, private router: Router,  private snackBar: MatSnackBar,public dialog: MatDialog,private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.list();
  }

  // For get all List of given folder
  list() {
    let path: string = '';
    const folderName = localStorage.getItem('folderName');
    if(folderName && folderName != 'some/other') {
      this.showdbclick = true;
      path = folderName;
    } else{
      this.showdbclick = false;
      localStorage.setItem('folderName', 'some/other');
      path = 'some/other';
    }
    this.path = path;
    this.loaderService.show();
    // Calling the list api
    this.folderCrudService.list(path).subscribe((data) => {
      if(data){
        this.dataSource = data
        this.loaderService.hide()
      }
      else {
        this.loaderService.hide();
        this.snackBar.open('Something was wrong.', '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      }
    })
  }

  // Add New Folder
  addNew() {
    this.router.navigate(['/create']);
  }

  // Edit Folder
  edit(name: string) {
    this.router.navigate(['/update', { name: name }])
  }

  // Delete Folder
  delete(name: string) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: '30%',
      width: '35%',
      data: { message: 'Are you sure you want to delete this item?' }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        const pathName = localStorage.getItem('folderName') + '/' + name;
        this.loaderService.show();
        // delete api calling
        this.folderCrudService.deleteFolder(pathName).subscribe(() => {
          this.list();
          this.loaderService.hide();
        })
      }
    });
  }

  // Double click function for enter the folder
  onRowDoubleClick(data: TableElement) {
    if(data.type != 'FILE') {
      const path = localStorage.getItem('folderName') + '/' + data.name;
      this.path = path;
      this.loaderService.show();
      this. showdbclick = true;
      localStorage.setItem('folderName', path);
      // list api calling
      this.folderCrudService.list(path).subscribe((data) => {
        if(data){
          this.dataSource = data
          this.loaderService.hide()
        }
        else {
          this.loaderService.hide();
          this.snackBar.open('Something was wrong.', '', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
          });
        }
      })
    }
  }

  // Back to main list screen
  backMain() {
    let path = localStorage.getItem('folderName');
    if(path){
      // To remove the last string till '/'
      const parts = path.split('/');
      parts.pop(); // Remove the last part
      path = parts.join('/');
      this.path = path;
      localStorage.setItem('folderName',path);
      this.list();
    }
  }
}