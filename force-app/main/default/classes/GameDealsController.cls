public with sharing class GameDealsController {
    
    @AuraEnabled(cacheable=true)
    public static List<Object> getTitleDeals(String searchTitle) { 
        return getApiData('callout:CheapsharkAPI/deals?title=' + searchTitle);
    }

    @AuraEnabled(cacheable=true)
    public static List<Object> getStores() { 
        return getApiData('callout:CheapsharkAPI/stores');
    }

    @AuraEnabled(cacheable=true)
    public static List<Object> getApiData(String endpoint) {
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpoint);
        request.setMethod('GET');

        List<Object> data = new List<Object>();
        String result = null;
        
        try {
            HttpResponse response = http.send(request);

            if(response.getStatusCode() == 200)
                result = response.getBody();
            else
                throw new CalloutException(response.getBody());
                
        } catch(Exception e) {
            System.debug(e);
        }

        if(!String.isBlank(result))
            data = (List<Object>) JSON.deserializeUntyped(result);

        return data;
    }
}