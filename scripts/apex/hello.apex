// Use .apex files to store anonymous Apex.
// You can execute anonymous Apex in VS Code by selecting the
//     apex text and running the command:
//     SFDX: Execute Anonymous Apex with Currently Selected Text
// You can also execute the entire file by running the command:
//     SFDX: Execute Anonymous Apex with Editor Contents

Http http = new Http();
HttpRequest request = new HttpRequest();
request.setEndpoint('callout:CheapsharkAPI/deals?storeID=1&upperPrice=15');
request.setMethod('GET');
HttpResponse response = http.send(request);

if(response.getStatusCode() == 200) {
    system.debug('raw results: ' + response.getBody());
    List<Object> results = (List<Object>) JSON.deserializeUntyped(response.getBody());
    system.debug('deserial results: ' + results);
}