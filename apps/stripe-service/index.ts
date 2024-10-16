const port = process.env.PORT || 3001;

console.log(`Stripe service is running ${port}`);

Bun.serve({
    port,
    fetch(req) {
      const url = new URL(req.url);
      const path = url.pathname;
      if(path === "/") {
        return new Response("OK", { status: 200 });
      }
      if(path === '/stripe') {
        return new Response(`${process.env.MSG || "Hello World"}`, { status: 200 });
      }
      return new Response("Not Found", { status: 404 });
    },
    error(error) {
        return new Response(`<pre>${error}\n${error.stack}</pre>`, {
            headers: {
                "Content-Type": "text/html",
            },
        });
    },
});

console.log(`Stripe service is running ${port}`);
