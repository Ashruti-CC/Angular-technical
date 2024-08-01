import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CrudComponent } from './modules/crud/crud.component';
import { CreateModelComponent } from './modules/crud/create-model/create-model.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  { path: 'list', component: CrudComponent },
  { path: 'create', component: CreateModelComponent},
  { path: 'update', component: CreateModelComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
