const originalFetch = window.fetch;

window.fetch = async (...args) => {
  const [url, config] = args;

  const requestConfig = {
    ...config,
    headers: {
      ...config?.headers,
      'JStudio-HMAC-Signature': 'jstudio',
      'JStudio-HMAC-Timestamp': 'jstudio',
    },
  };

//   console.log('Request Headers:', requestConfig.headers);

  return originalFetch(url, requestConfig);
};
