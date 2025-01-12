import { Injectable } from '@angular/core';
import {Database, ref, get, push, set, DataSnapshot, child, objectVal} from '@angular/fire/database';
import {Person} from '../components/models/person.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private COLLECTION_NAME="persons"

  constructor(private database:Database) { }

  savePerson(person: Person): Promise<void> {
    // Referencia inicial al nodo de Firebase, usando el ID de la persona
    let personRef = ref(this.database, `/persons/${person.uid}`);

    // Guardar la persona en Firebase usando el ID asignado
    return set(personRef,person);
  }

  // Obtener datos de la persona por UID

  getByUid(uid: string): Observable<Person | null> {
    const usersRef = ref(this.database,this.COLLECTION_NAME);
    const userRef = child(usersRef,uid);

    return objectVal(userRef) as Observable<Person>
  }





}
