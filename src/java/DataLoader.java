import java.util.ArrayList;
import java.util.List;

public class DataLoader {

    public static List<String> loadSleepData() {
    
        List<String> sleepData = new ArrayList<>();
        sleepData.add("UserID: U001, SleepHours: 6.5, REM: 2.0");
        sleepData.add("UserID: U002, SleepHours: 5.0, REM: 1.5");
        sleepData.add("UserID: U003, SleepHours: 7.5, REM: 2.5");
        return sleepData;
    }

    public static void main(String[] args) {
        List<String> data = loadSleepData();
        System.out.println("Loaded Sleep Data:");
        for(String entry : data) {
            System.out.println(entry);
        }
    }
}
