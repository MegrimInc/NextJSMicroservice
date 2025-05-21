export enum Environment {
  Test = 'test',
  Live = 'live'
}

// THIS IS WHERE YOU CHANGE THE ENVIRONMENT TO TEST AND LIVE 
const CURRENT_ENVIRONMENT: Environment = Environment.Test;

export class AppConfig {
  static environment: Environment = CURRENT_ENVIRONMENT;

  // ---------- POSTGRES ----------
  static get postgresHttpBaseUrl(): string {
    switch (this.environment) {
      case Environment.Test:
        return 'https://www.barzzy.site/postgres-test-http';
      case Environment.Live:
        return 'https://www.barzzy.site/postgres-live-http';
    }
  }

  static get postgresWsBaseUrl(): string {
    switch (this.environment) {
      case Environment.Test:
        return 'wss://www.barzzy.site/postgres-test-ws';
      case Environment.Live:
        return 'wss://www.barzzy.site/postgres-live-ws';
    }
  }

  // ---------- REDIS ----------
  static get redisHttpBaseUrl(): string {
    switch (this.environment) {
      case Environment.Test:
        return 'https://www.barzzy.site/redis-test-http';
      case Environment.Live:
        return 'https://www.barzzy.site/redis-live-http';
    }
  }

  static get redisWsBaseUrl(): string {
    switch (this.environment) {
      case Environment.Test:
        return 'wss://www.barzzy.site/redis-test-ws';
      case Environment.Live:
        return 'wss://www.barzzy.site/redis-live-ws';
    }
  }
}