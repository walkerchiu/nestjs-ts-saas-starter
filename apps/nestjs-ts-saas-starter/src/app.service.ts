import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('NOTIFY_SERVICE') private readonly client: ClientProxy) {}

  async getHello(): Promise<string> {
    const timestamp = new Date().toISOString();
    const receive = await firstValueFrom(
      this.client.send<string>('notify', {
        data: { name: 'demo', email: 'demo@example.com' },
        timestamp,
      }),
    );

    return receive;
  }
}
