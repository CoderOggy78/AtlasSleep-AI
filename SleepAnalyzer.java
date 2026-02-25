public class SleepAnalyzer {

    public static String analyzeSleep(double sleepHours) {
        if (sleepHours < 6) {
            return "Sleep deficiency detected";
        } else if (sleepHours <= 8) {
            return "Sleep normal";
        } else {
            return "Oversleeping detected";
        }
    }

    public static void main(String[] args) {
        double sleep = 5.5;
        System.out.println("Sleep analysis: " + analyzeSleep(sleep));
    }
}
