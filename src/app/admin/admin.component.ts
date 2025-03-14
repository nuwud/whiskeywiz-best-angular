import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Quarter } from '../shared/models/quarter.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  
  quarters$!: Observable<Quarter[]>;
  selectedQuarter: Quarter | null = null;
  isLoading = true;
  error = '';

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.loadQuarters();
  }

  loadQuarters(): void {
    try {
      this.isLoading = true;
      this.quarters$ = this.firestore.collection<Quarter>('quarters', ref => 
        ref.orderBy('releaseDate', 'desc')
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Quarter;
          const id = a.payload.doc.id;
          return { id, ...data };
        }))
      );
    } catch (error) {
      console.error('Error loading quarters:', error);
      this.error = 'Failed to load quarters';
    } finally {
      this.isLoading = false;
    }
  }

  selectQuarter(quarter: Quarter): void {
    this.selectedQuarter = quarter;
  }

  createQuarter(quarter: Quarter): void {
    this.firestore.collection('quarters').add({
      ...quarter,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .then(() => {
      console.log('Quarter created successfully');
    })
    .catch(error => {
      console.error('Error creating quarter:', error);
      this.error = 'Failed to create quarter';
    });
  }

  updateQuarter(quarter: Quarter): void {
    if (!quarter.id) {
      this.error = 'Cannot update quarter without ID';
      return;
    }
    
    this.firestore.doc(`quarters/${quarter.id}`).update({
      ...quarter,
      updatedAt: new Date().toISOString()
    })
    .then(() => {
      console.log('Quarter updated successfully');
      this.selectedQuarter = null;
    })
    .catch(error => {
      console.error('Error updating quarter:', error);
      this.error = 'Failed to update quarter';
    });
  }

  deleteQuarter(id: string): void {
    if (confirm('Are you sure you want to delete this quarter?')) {
      this.firestore.doc(`quarters/${id}`).delete()
      .then(() => {
        console.log('Quarter deleted successfully');
        if (this.selectedQuarter?.id === id) {
          this.selectedQuarter = null;
        }
      })
      .catch(error => {
        console.error('Error deleting quarter:', error);
        this.error = 'Failed to delete quarter';
      });
    }
  }

  toggleActivation(quarter: Quarter): void {
    if (!quarter.id) return;
    
    this.firestore.doc(`quarters/${quarter.id}`).update({
      active: !quarter.active,
      updatedAt: new Date().toISOString()
    })
    .then(() => {
      console.log(`Quarter ${quarter.active ? 'deactivated' : 'activated'} successfully`);
    })
    .catch(error => {
      console.error('Error toggling quarter activation:', error);
      this.error = 'Failed to update quarter status';
    });
  }
}