interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  skipAuth?: boolean; // New optional parameter to skip authentication
}

export async function apiRequest<T>(
  url: string,
  options?: RequestOptions
): Promise<T> {
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const headers: Record<string, string> = {
    ...defaultHeaders,
    ...(options?.headers || {}),
  };

  try {
    if (!options?.skipAuth) {
      const token = await getValidToken();
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
      process.env['NEXT_PUBLIC_API_URL'] + '/' + url,
      {
        ...options,
        headers,
      }
    );

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${error.message}`);
    } else {
      throw new Error('Unknown error occurred');
    }
  }
}

function getValidToken(): string {
  return "auth isn't setup yet";
}
