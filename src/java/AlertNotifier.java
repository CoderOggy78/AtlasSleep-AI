public class AlertNotifier {

    public static void sendAlert(String userId, String message) {
        System.out.println("ALERT for " + userId + ": " + message);
    }

    public static void main(String[] args) {
        sendAlert("U001", "High risk of sleep apnea detected. Consult a specialist.");
        sendAlert("U002", "Moderate risk of diabetes. Monitor your diet.");
    }
}
