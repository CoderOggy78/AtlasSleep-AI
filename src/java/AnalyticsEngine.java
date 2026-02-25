public class AnalyticsEngine {

    public static String calculateRisk(double sleepHours, double heartRate, double bloodSugar) {
        if (sleepHours < 6 && heartRate > 80 && bloodSugar > 120) {
            return "High Risk";
        } else if (sleepHours >= 6 && sleepHours <= 8) {
            return "Moderate Risk";
        } else {
            return "Low Risk";
        }
    }

    public static void main(String[] args) {
        String risk = calculateRisk(5.5, 85, 130);
        System.out.println("Calculated Risk: " + risk);
    }
}
