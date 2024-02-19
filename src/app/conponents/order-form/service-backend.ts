import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class serviceBackend {

  constructor(private http: HttpClient) { }

  enviarDadosParaBackend(data: any) {
    return this.http.post<any>('http://localhost:8080/purchase/processOrder', data);
  }
}
