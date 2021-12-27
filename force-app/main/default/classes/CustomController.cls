public with sharing class CustomController {
    @AuraEnabled(cacheable=true)
    public static List<Team__c> getTeamList() {
        return [
            SELECT Id, Name
            FROM Team__c
        ];
    }

    @AuraEnabled
    public static Boolean insertMember(String name, Id teamId, String skills) {
        Team_Member__c member = new Team_Member__c(
            Name = name,
            Team__c = teamId,
            Skills__c = skills
        );
        try{
            insert member;
            return true;
        }
        catch(Exception e){
            return false;
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Team_Member__c> getTeamMembers(Id teamId) {
        if(teamId == null){
            return new List<Team_Member__c>();
        }
        return [
            SELECT Id, Name, Skills__c, Team__r.Name
            FROM Team_Member__c
            WHERE Team__c =:teamId
        ];
    }
    @AuraEnabled(cacheable=true)
    public static List<Team_Member__c> getAllTeamMembers() {
        return [
            SELECT Id, Name, Skills__c, Team__r.Name
            FROM Team_Member__c
            ORDER BY Id DESC
        ];
    }
}
