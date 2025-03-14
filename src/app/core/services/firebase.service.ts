import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, from, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Quarter, Sample, Question, QuarterResult } from '../../shared/models/quarter.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {}

  // Quarters
  getQuarters(): Observable<Quarter[]> {
    return this.firestore.collection<Quarter>('quarters', ref => 
      ref.orderBy('releaseDate', 'desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Quarter;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getQuarterById(id: string): Observable<Quarter> {
    return this.firestore.doc<Quarter>(`quarters/${id}`).valueChanges().pipe(
      map(quarter => {
        if (!quarter) throw new Error(`Quarter with ID ${id} not found`);
        return { id, ...quarter };
      })
    );
  }

  createQuarter(quarter: Quarter): Promise<string> {
    const id = this.firestore.createId();
    const newQuarter = {
      ...quarter,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return this.firestore.doc(`quarters/${id}`).set(newQuarter)
      .then(() => id);
  }

  updateQuarter(id: string, quarter: Partial<Quarter>): Promise<void> {
    const updateData = {
      ...quarter,
      updatedAt: new Date().toISOString()
    };
    
    return this.firestore.doc(`quarters/${id}`).update(updateData);
  }

  deleteQuarter(id: string): Promise<void> {
    return this.firestore.doc(`quarters/${id}`).delete();
  }

  // Samples
  getSamplesByQuarterId(quarterId: string): Observable<Sample[]> {
    return this.firestore.collection<Sample>(`quarters/${quarterId}/samples`, ref => 
      ref.orderBy('order', 'asc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Sample;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  createSample(quarterId: string, sample: Sample): Promise<string> {
    const id = this.firestore.createId();
    return this.firestore.doc(`quarters/${quarterId}/samples/${id}`).set(sample)
      .then(() => id);
  }

  updateSample(quarterId: string, sampleId: string, sample: Partial<Sample>): Promise<void> {
    return this.firestore.doc(`quarters/${quarterId}/samples/${sampleId}`).update(sample);
  }

  deleteSample(quarterId: string, sampleId: string): Promise<void> {
    return this.firestore.doc(`quarters/${quarterId}/samples/${sampleId}`).delete();
  }

  // Questions
  getQuestionsByQuarterId(quarterId: string): Observable<Question[]> {
    return this.firestore.collection<Question>(`quarters/${quarterId}/questions`).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Question;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Results
  saveQuarterResult(result: QuarterResult): Promise<string> {
    const id = this.firestore.createId();
    return this.firestore.doc(`results/${id}`).set({
      ...result,
      createdAt: new Date().toISOString()
    }).then(() => id);
  }

  getQuarterResults(quarterId: string): Observable<QuarterResult[]> {
    return this.firestore.collection<QuarterResult>('results', ref => 
      ref.where('quarterId', '==', quarterId).orderBy('completedAt', 'desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as QuarterResult;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  getUserResults(userId: string): Observable<QuarterResult[]> {
    return this.firestore.collection<QuarterResult>('results', ref => 
      ref.where('userId', '==', userId).orderBy('completedAt', 'desc')
    ).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as QuarterResult;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    );
  }

  // Image Storage
  uploadImage(path: string, file: File): Observable<string> {
    const filePath = `images/${path}/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    
    return from(task).pipe(
      switchMap(() => fileRef.getDownloadURL()),
      catchError(error => throwError(() => new Error(`Upload failed: ${error.message}`)))
    );
  }
}