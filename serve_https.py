import argparse
import http.server
import os
import ssl
from functools import partial


def main() -> None:
    parser = argparse.ArgumentParser(description="Serve this site over HTTPS.")
    parser.add_argument("--host", default="0.0.0.0")
    parser.add_argument("--port", type=int, default=8443)
    parser.add_argument("--cert", required=True)
    parser.add_argument("--key", required=True)
    parser.add_argument("--directory", default=".")
    args = parser.parse_args()

    directory = os.path.abspath(args.directory)
    handler = partial(http.server.SimpleHTTPRequestHandler, directory=directory)
    httpd = http.server.ThreadingHTTPServer((args.host, args.port), handler)

    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=args.cert, keyfile=args.key)
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)

    print(f"Serving HTTPS from {directory}")
    print(f"URL: https://localhost:{args.port}/")
    httpd.serve_forever()


if __name__ == "__main__":
    main()
