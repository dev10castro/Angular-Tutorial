import { Injectable } from '@angular/core';
import {Database, ref,get,  push, set, DataSnapshot} from '@angular/fire/database';
import {Person} from '../components/models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private database:Database) { }

  savePerson(person: Person): Promise<void> {
    // Referencia inicial al nodo de Firebase, usando el ID de la persona
    let personRef = ref(this.database, `/persons/${person.uid}`);

    // Guardar la persona en Firebase usando el ID asignado
    return set(personRef,person);
  }

  // Obtener datos de la persona por UID

  getByUid(uid: string): Promise<Person | null> {
    const personRef = ref(this.database, `/persons/${uid}`);
    return get(personRef).then((snapshot) => {
      if (snapshot.exists()) {
        return snapshot.val() as Person;
      }
      return null;
    });
  }





}
