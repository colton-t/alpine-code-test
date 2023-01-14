public with sharing class GameDealsController {
    
    @AuraEnabled
    public static List<Object> getGameDeals(String criteria) {
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://www.cheapshark.com/api/1.0/deals?' + criteria);
        request.setMethod('GET');

        List<Object> games = new List<Object>();
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
            games = (List<Object>) JSON.deserializeUntyped(result); //(List<GameDeals>) System.JSON.deserialize(result, List<GameDeals>.class);
            
        return games;
    }
    

    // Wrapper class for parsing JSON response data from callout
    public class GameDeals {

        public String internalName;
        public String title;
        public String metacriticLink;
        public String dealID;
        public String storeID;
        public String gameID;
        public String salePrice;
        public String normalPrice;
        public String isOnSale;
        public String savings;
        public String metacriticScore;
        public String steamRatingText;
        public String steamRatingPercent;
        public String steamRatingCount;
        public String steamAppID;
        public Integer releaseDate;
        public Integer lastChange;
        public String dealRating;
        public String thumb;

    }
}