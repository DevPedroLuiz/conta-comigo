import { Injectable, Logger } from "@nestjs/common";

export interface AppEvent<TPayload = Record<string, unknown>> {
  name: string;
  payload: TPayload;
  occurredAt: string;
}

@Injectable()
export class EventBusService {
  private readonly logger = new Logger(EventBusService.name);
  private readonly events: AppEvent[] = [];

  publish<TPayload extends Record<string, unknown>>(name: string, payload: TPayload) {
    const event = { name, payload, occurredAt: new Date().toISOString() };
    this.events.push(event);
    this.logger.log(`${name} ${JSON.stringify(payload)}`);
    return event;
  }

  list() {
    return [...this.events];
  }
}

