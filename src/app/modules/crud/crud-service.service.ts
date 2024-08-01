import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  catchError,
  finalize,
  map,
  of,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CrudServiceService {
  isLoadingSubject: BehaviorSubject<boolean> | undefined;
  private apiUrl = 'https://api-jrdvg5xikq-ew.a.run.app/files';

  constructor(private http: HttpClient) {}

  // For call create folder api
  createFolder(path: string): Observable<any> {
    const foldername = localStorage.getItem('folderName');
    path = foldername + '/' + path;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.apiUrl, { path }, { headers }).pipe(
      map((data) => {
        if (data) {
          return data;
        }
        return;
      }),
      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject && this.isLoadingSubject.next(false))
    );
  }

  // For call list folder api
  list(folderName: string): Observable<any> {
    const url = this.apiUrl + '?path=' + folderName;
    return this.http.get<any>(url).pipe(
      map((data) => {
        if (data) {
          return data;
        }
        return;
      }),
      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject && this.isLoadingSubject.next(false))
    );
  }

  // For call update folder api
  updateFolder(oldpath: string, newpath: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .put<any>(
        this.apiUrl,
        { oldPath: oldpath, newPath: newpath, isDirectory: true },
        { headers }
      )
      .pipe(
        map((data) => {
          if (data) {
            return data;
          }
          return;
        }),
        catchError((err) => {
          return of(err.error);
        }),
        finalize(
          () => this.isLoadingSubject && this.isLoadingSubject.next(false)
        )
      );
  }

  // // For call delete folder api
  deleteFolder(path: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.delete<any>(this.apiUrl,{ headers, body: { path , isDirectory: true }}).pipe(
      map((data) => {
        if (data) {
          return data;
        }
        return;
      }),
      catchError((err) => {
        return of(err.error);
      }),
      finalize(() => this.isLoadingSubject && this.isLoadingSubject.next(false))
    );
  }
}
