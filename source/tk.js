(function replaceHostname(newHostname) {
	var dl = document.location,
  		proto = dl.protocol,
      port = dl.port,
      pathname = dl.pathname
  document.location.replace(`${proto}//${newHostname}:${port}${pathname}`)
})('localhost.charlesproxy.com')