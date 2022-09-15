import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {IPerson, IPersonPagination} from "../interfaces/person";
import {map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private  http: HttpClient) { }
  usersApiUrl = 'http://localhost:3000/person';


  getPerson(page: number , pageSize: number): Observable<IPersonPagination> {
    return this.http
      .get<IPerson[]>(this.usersApiUrl).pipe( map((per) => ({
        items: per.slice(page * pageSize , pageSize * (page + 1)),
        page: page,
        pageSize: pageSize,
        totalItems: per.length
      })))
  }

  getPersonDetail(id: number): Observable<IPerson>{
    return this.http.get<IPerson>(`${this.usersApiUrl}/${id}`)
  }

  createPerson(person: IPerson): Observable<IPerson>{
    return  this.http.post<IPerson>(this.usersApiUrl, person)
  }
  updatePerson(persionId: number, person: IPerson): Observable<IPerson>{
    return  this.http.put<IPerson>(`${this.usersApiUrl}/${persionId}`, person)
  }
  deletePerson(personId: number):Observable<any>{
    return this.http.delete(`${this.usersApiUrl}/${personId}`)
  }

}
