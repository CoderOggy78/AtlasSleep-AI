/*
AtlasSleep AI - User Data Class
Purpose: Placeholder for repo structure
*/
public class UserData {
    private String userId;
    private int age;
    private double sleepHours;
    private double heartRate;

    public UserData(String userId, int age, double sleepHours, double heartRate) {
        this.userId = userId;
        this.age = age;
        this.sleepHours = sleepHours;
        this.heartRate = heartRate;
    }

    public void printSummary() {
        System.out.println("User ID: " + userId);
        System.out.println("Age: " + age);
        System.out.println("Sleep Hours: " + sleepHours);
        System.out.println("Heart Rate: " + heartRate);
    }
}
