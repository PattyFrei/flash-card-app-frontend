import { Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackBarService {
  durationInSeconds = 5;
  horizontalPosition: MatSnackBarHorizontalPosition = 'right';

  constructor(private snackBar: MatSnackBar) {}

  open(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
    });
  }
}
