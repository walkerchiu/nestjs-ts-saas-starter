import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';

import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getHello(): string {
    return this.notificationService.getHello();
  }

  @MessagePattern('notify')
  async notify(payload: NotifiyPayload) {
    Logger.log('-- Payload Begin -- ');

    console.log('Timestamp: ' + payload.timestamp);
    console.log('Data: ' + JSON.stringify(payload.data));

    let name: string = payload.data['name'];
    let email: string = payload.data['email'];

    Logger.log('-- Payload End --');

    return 'Hello ' + name + ' (' + email + ')';
  }
}

interface NotifiyPayload {
  data: object;
  timestamp: string;
}
