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
        return 'https://www.megrim.com/postgres-test-http';
      case Environment.Live:
        return 'https://www.megrim.com/postgres-live-http';
    }
  }

  static get postgresWsBaseUrl(): string {
    switch (this.environment) {
      case Environment.Test:
        return 'wss://www.megrim.com/postgres-test-ws';
      case Environment.Live:
        return 'wss://www.megrim.com/postgres-live-ws';
    }
  }

  // ---------- REDIS ----------
  static get redisHttpBaseUrl(): string {
    switch (this.environment) {
      case Environment.Test:
        return 'https://www.megrim.com/redis-test-http';
      case Environment.Live:
        return 'https://www.megrim.com/redis-live-http';
    }
  }

  static get redisWsBaseUrl(): string {
    switch (this.environment) {
      case Environment.Test:
        return 'wss://www.megrim.com/redis-test-ws';
      case Environment.Live:
        return 'wss://www.megrim.com/redis-live-ws';
    }
  }

  static async fetchWithAuth(
  input: RequestInfo,
  init: RequestInit = {},
  router?: { push: (path: string) => void }
): Promise<Response> {
  const res = await fetch(input, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("loginStatusChanged"));
      if (router) router.push("/login");
    }
    throw new Error("Session expired");
  }

  return res;
}
}