export default {
  async fetch(request, env) {
    const response = await fetch(request);
    const headers = new Headers(response.headers);
    headers.set(
      'Link',
      '</.well-known/api-catalog>; rel="api-catalog", </llms.txt>; rel="describedby"; type="text/plain", </auth.md>; rel="service-doc"; type="text/markdown", </.well-known/oauth-protected-resource>; rel="service-desc"; type="application/json"'
    );
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
};
