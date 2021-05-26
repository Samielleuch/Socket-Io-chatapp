import { Injectable } from '@angular/core';
import { ChatModule } from '../../chat.module';

import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { Message } from '../model/message';
import { Event } from '../model/event';

import * as socketIo from 'socket.io-client';
import { HttpClient } from '@angular/common/http';

const SERVER_URL = 'http://localhost:8080';

@Injectable()
export class SocketService {
    private httpClient: HttpClient;

  private socket;

  constructor(http: HttpClient) {
    this.httpClient = http;
  }
  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
}
public challenge(){
    this.httpClient.get('assets/MyRequest.csr', { responseType: 'text' })
      .subscribe(data => this.socket.emit('challenge', data));
    

}
public send(message: Message): void {
    this.socket.emit('message', message);
}

public onMessage(): Observable<Message> {
    return new Observable<Message>(observer => {
        this.socket.on('message', (data: Message) => observer.next(data));
    });
}

public onCert(): Observable<any> {
    return new Observable<any>(observer => {
        this.socket.on('cert', (data) => observer.next(data));
    });
}

public onEvent(event: Event): Observable<any> {
    return new Observable<Event>(observer => {
        this.socket.on(event, () => observer.next());
    });
}
}
