public class HealthMetrics {
    private double bloodPressure;
    private double bloodSugar;

    public HealthMetrics(double bloodPressure, double bloodSugar) {
        this.bloodPressure = bloodPressure;
        this.bloodSugar = bloodSugar;
    }

    public void printMetrics() {
        System.out.println("Blood Pressure: " + bloodPressure);
        System.out.println("Blood Sugar: " + bloodSugar);
    }

    public boolean isHighRisk() {
        return bloodPressure > 140 || bloodSugar > 130;
    }
}
