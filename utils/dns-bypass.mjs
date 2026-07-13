import dns from "node:dns";

// Save originals
const originalResolve = dns.resolve;
const originalResolveSrv = dns.resolveSrv;
let originalPromisesResolve;
let originalPromisesResolveSrv;
try {
  originalPromisesResolve = dns.promises?.resolve;
  originalPromisesResolveSrv = dns.promises?.resolveSrv;
} catch (e) {
  // Ignore
}

// Override callbacks dns.resolveSrv
dns.resolveSrv = function(hostname, callback) {
  const resolver = new dns.Resolver();
  resolver.setServers(["8.8.8.8", "1.1.1.1"]);
  resolver.resolveSrv(hostname, (err, addresses) => {
    if (err) {
      if (typeof originalResolveSrv === "function") {
        originalResolveSrv(hostname, callback);
      } else {
        callback(err);
      }
    } else {
      callback(null, addresses);
    }
  });
};

// Override callbacks dns.resolve
dns.resolve = function(hostname, rrtype, callback) {
  const actualCallback = typeof rrtype === "function" ? rrtype : callback;
  const actualRrtype = typeof rrtype === "string" ? rrtype : "A";

  if (hostname.includes("vochiqo") || hostname.includes("mongodb")) {
    const resolver = new dns.Resolver();
    resolver.setServers(["8.8.8.8", "1.1.1.1"]);
    resolver.resolve(hostname, actualRrtype, (err, addresses) => {
      if (err) {
        if (typeof originalResolve === "function") {
          originalResolve(hostname, actualRrtype, actualCallback);
        } else {
          actualCallback(err);
        }
      } else {
        actualCallback(null, addresses);
      }
    });
  } else {
    return originalResolve.apply(this, arguments);
  }
};

// Override promises Resolver
if (dns.promises) {
  dns.promises.resolveSrv = async function(hostname) {
    const resolver = new dns.promises.Resolver();
    resolver.setServers(["8.8.8.8", "1.1.1.1"]);
    try {
      return await resolver.resolveSrv(hostname);
    } catch (err) {
      if (typeof originalPromisesResolveSrv === "function") {
        return await originalPromisesResolveSrv(hostname);
      }
      throw err;
    }
  };

  dns.promises.resolve = async function(hostname, rrtype) {
    if (hostname.includes("vochiqo") || hostname.includes("mongodb")) {
      const resolver = new dns.promises.Resolver();
      resolver.setServers(["8.8.8.8", "1.1.1.1"]);
      try {
        return await resolver.resolve(hostname, rrtype);
      } catch (err) {
        if (typeof originalPromisesResolve === "function") {
          return await originalPromisesResolve(hostname, rrtype);
        }
        throw err;
      }
    }
    return await originalPromisesResolve.apply(this, arguments);
  };
}
