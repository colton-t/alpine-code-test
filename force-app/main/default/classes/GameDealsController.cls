public with sharing class GameDealsController {
    
    public static List<GameDeals> getGameDeals(String criteria) {
        
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:CheapsharkAPI' + criteria);
        request.setMethod('GET');

        List<GameDeals> games = new List<GameDeals>();
        
        try {
            HttpResponse response = http.send(request);

            if(response.getStatusCode() == 200) {
                if(!String.isBlank())
                    games = parse(response.getBody());
            }
            else
                throw new CalloutException(response.getBody());

        } catch(Exception e) {
            System.debug(e);
        }
        
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
    
        public static List<GameDeals> parse(String json) {
            return (List<GameDeals>) System.JSON.deserialize(json, List<GameDeals>.class);
        }
    }
}