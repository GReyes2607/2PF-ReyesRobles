import { Component } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Classes } from './models';
import { MatDialog } from '@angular/material/dialog';
import { ClassesService } from '../models/classes.service';
import { ClassesFormDialogComponent } from './components/classes-form-dialog/classes-form-dialog.component';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent {
  public classes: Observable<Classes[]>;
  public destroy = new Subject<boolean>();

  constructor(private matDialog: MatDialog, private classesService: ClassesService) {
    this.classesService.loadClasses();
    this.classes = this.classesService.getClasses();

  }

  onCreateClasses(): void {
    this.matDialog.open(ClassesFormDialogComponent)
      .afterClosed().subscribe({
        next: (newClasse) => {
          if (newClasse) {
            this.classesService.createClasses({
              name: newClasse.name,
              turns: newClasse.turns,
              nameCourse: newClasse.nameCourse,
            })
          }
        }
      })
  }

  onDeleteClasses(classesDelete: Classes): void {
    if (confirm(`¿Esta seguro que desea eliminar el curso ${classesDelete.name} ?`)) {
      this.classesService.deleteClassesById(classesDelete.id);
    }

  }

  onEditClasses(classesEdit: Classes): void {
    this.matDialog.open(ClassesFormDialogComponent, {
      data: classesEdit
    })
      .afterClosed()
      .subscribe({
        next: (dataEdit) => {
          if (dataEdit) {
            this.classesService.updateClassesById(classesEdit.id, dataEdit)
          }

        }
      })
  }
}
