public class ReportGenerator {

    public static void generateReport(String userId, String sleepStatus, boolean highRisk) {
        System.out.println("----- Health Report -----");
        System.out.println("User ID: " + userId);
        System.out.println("Sleep Status: " + sleepStatus);
        System.out.println("High Risk Flag: " + highRisk);
        System.out.println("-------------------------");
    }

    public static void main(String[] args) {
        generateReport("U12345", "Sleep deficiency detected", true);
    }
}
