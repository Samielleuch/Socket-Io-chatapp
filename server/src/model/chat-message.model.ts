import { User } from './user.model';
import { Message } from './message.model';

export class ChatMessage extends Message{
    constructor(from: User, content: string) {
        super(from, content);
    }
}