public class AccountListControllerLwc {
    @auraEnabled
    public static List<Account> queryAccountsByRevenue(Decimal annualRevenue){
        return [ SELECT Id, Name, AnnualRevenue FROM Account where AnnualRevenue >=: annualRevenue];
    }
}