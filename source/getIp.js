const os = require( 'os' ),
    networkInterfaces = os.networkInterfaces( );

let response, ip;
if ('en0' in networkInterfaces) {
    ip = networkInterfaces.en0.filter(itf => itf.family === 'IPv4')[0].cidr.replace(/(\/.*)/, '');
    response = `your ip address is:\n\n\t${ip}\n`;
} else {
    response = "Sorry try to run the following command: \n > ifconfig en0 | grep inet | grep -v inet6 | awk '{print $2}'";
}
console.log(response);