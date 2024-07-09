// REQUEST_BASE_LINK = "http://localhost:3000/api/"

function RequestAPI(endpoint, postdata)
{
	fetch('http://localhost:3000/api/' + endpoint, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: postdata ? JSON.stringify(postdata) : NULL
	  })
	  .then(() => {
		console.log('new POST send !');
	  })
	  .then(response => response.json())
	  // need to analyse the response consequently //
}

export default RequestAPI