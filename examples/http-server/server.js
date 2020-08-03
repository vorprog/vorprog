const http = require('http');
const trace = require('vorprog-trace');

/** @param {http.IncomingMessage} request */
const getRequestDetails = (request) => {
  let body = [];
  request.on('data', chunk => body.push(chunk))
  request.on('end', () => body = Buffer.concat(body).toString());

  return {
    method: request.method,
    url: request.url,
    headers: request.headers,
    body: body
  }
};

/** @returns {http.IncomingMessage} 
 * @param {import('https').RequestOptions} options
 * @param {String} body
*/
const makeRequest = async (options, body) => {
  const request = http.request(options, response => {
    const data = [];
    response.on('data', chunk => { data.push(chunk); });
    response.on('end', () => {
      result.data = Buffer.concat(data).toString();
      return response;
    });
  });

  request.on('error', err => { throw err });
  if (body) request.write(body);
  request.end();
};

/** @type {http.RequestListener} */
const requestListener = async (request, result) => {
  const requestDetails = getRequestDetails(request);
  trace(requestDetails);

  const externalResponse = await makeRequest({
    method: `POST`,
    protocol: `http://`,
    hostname: `google.com`,
    path: `/data`,
    headers = {
      Authorization = `Bearer ${user.token}`
    }
  }, JSON.stringify({ id: 123 }));
  trace(externalResponse);

  result.statusCode = 200;
  result.setHeader('test-header', 'test-value');
  result.write(`You visited ${requestDetails.url}. External request body: ${externalResponse.data}`);
  result.end();

  trace({ statusCode: result.statusCode, message: result.statusMessage, content: content, headers: result.getHeaders() });
};

http.createServer(requestListener).listen(8080);